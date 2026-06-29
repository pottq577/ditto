import Vision
import CoreImage
import UIKit

// MARK: - Error

@objc enum BackgroundRemovalError: Int, Error {
    case noSubject
    case processingFailed
}

// MARK: - Module

@objc(BackgroundRemovalModule)
final class BackgroundRemovalModule: NSObject {

    private let ciContext = CIContext()

    /// JS Bridge 노출: removeBackground(imageUri) → Promise<resultUri>
    @objc func removeBackground(
        _ imageUri: String,
        resolver resolve: @escaping RCTPromiseResolveBlock,
        rejecter reject: @escaping RCTPromiseRejectBlock
    ) {
        // file:// prefix 제거
        let path = imageUri.hasPrefix("file://")
            ? String(imageUri.dropFirst(7))
            : imageUri

        guard let inputImage = UIImage(contentsOfFile: path) else {
            reject("LOAD_FAILED", "이미지 로드 실패: \(imageUri)", nil)
            return
        }

        DispatchQueue.global(qos: .userInitiated).async { [weak self] in
            guard let self else { return }
            do {
                let result = try self.process(image: inputImage)
                // 처리 결과를 임시 파일로 저장
                let tmpDir = FileManager.default.temporaryDirectory
                let outURL = tmpDir.appendingPathComponent(
                    "nucci_\(Int(Date().timeIntervalSince1970)).png"
                )
                guard let pngData = result.pngData() else {
                    reject("PNG_FAILED", "PNG 변환 실패", nil)
                    return
                }
                try pngData.write(to: outURL)
                resolve(outURL.absoluteString)  // file:// scheme 포함
            } catch BackgroundRemovalError.noSubject {
                reject("NO_SUBJECT", "피사체를 찾을 수 없습니다", nil)
            } catch {
                reject("PROCESSING_FAILED", "누끼 처리 실패", error)
            }
        }
    }

    // MARK: - Private

    private func process(image: UIImage) throws -> UIImage {
        guard let cgImage = image.orientationNormalized().cgImage else {
            throw BackgroundRemovalError.processingFailed
        }

        let request = VNGenerateForegroundInstanceMaskRequest()
        let handler = VNImageRequestHandler(cgImage: cgImage, orientation: .up)
        try handler.perform([request])

        guard let observation = request.results?.first,
              !observation.allInstances.isEmpty else {
            throw BackgroundRemovalError.noSubject
        }

        // 풀프레임 마스크 (크롭 없음) — 업로드 후 표시 영역 정렬 유지
        let maskedBuffer = try observation.generateMaskedImage(
            ofInstances: observation.allInstances,
            from: handler,
            croppedToInstancesExtent: false
        )

        let ciImage = CIImage(cvPixelBuffer: maskedBuffer)
        guard let outputCG = ciContext.createCGImage(ciImage, from: ciImage.extent) else {
            throw BackgroundRemovalError.processingFailed
        }
        return UIImage(cgImage: outputCG)
            .trimmingTransparentPixels()
    }

    @objc static func requiresMainQueueSetup() -> Bool { false }
}

// MARK: - UIImage Extensions (catch/ImageUtils.swift 이식)

private extension UIImage {

    /// EXIF 회전을 픽셀에 베이크해 .up 방향 이미지 반환
    func orientationNormalized() -> UIImage {
        if imageOrientation == .up { return self }
        let fmt = UIGraphicsImageRendererFormat.default()
        fmt.scale = scale
        fmt.opaque = false
        return UIGraphicsImageRenderer(size: size, format: fmt).image { _ in
            draw(in: CGRect(origin: .zero, size: size))
        }
    }

    /// 투명 여백 트림
    func trimmingTransparentPixels(alphaThreshold: UInt8 = 8) -> UIImage {
        guard let cg = cgImage, cg.width > 0, cg.height > 0 else { return self }
        let w = cg.width, h = cg.height
        let bytesPerRow = w * 4
        var data = [UInt8](repeating: 0, count: w * h * 4)
        let space = CGColorSpaceCreateDeviceRGB()
        guard let ctx = CGContext(
            data: &data, width: w, height: h, bitsPerComponent: 8,
            bytesPerRow: bytesPerRow, space: space,
            bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
        ) else { return self }
        ctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h))

        var minX = w, minY = h, maxX = -1, maxY = -1
        for y in 0..<h {
            let row = y * bytesPerRow
            for x in 0..<w where data[row + x * 4 + 3] >= alphaThreshold {
                if x < minX { minX = x }
                if x > maxX { maxX = x }
                if y < minY { minY = y }
                if y > maxY { maxY = y }
            }
        }
        guard maxX >= minX, maxY >= minY else { return self }
        let rect = CGRect(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1)
        guard let cropped = cg.cropping(to: rect) else { return self }
        return UIImage(cgImage: cropped, scale: scale, orientation: .up)
    }
}
