package com.ditto.frontend.backgroundremoval

import android.graphics.Bitmap
import android.net.Uri
import com.facebook.react.bridge.*
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.segmentation.subject.SubjectSegmentation
import com.google.mlkit.vision.segmentation.subject.SubjectSegmenterOptions
import java.io.File
import java.io.FileOutputStream

class BackgroundRemovalModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "BackgroundRemovalModule"
    }

    @ReactMethod
    fun removeBackground(imageUri: String, promise: Promise) {
        try {
            val uri = Uri.parse(imageUri)
            val image = InputImage.fromFilePath(reactApplicationContext, uri)

            val options = SubjectSegmenterOptions.Builder()
                .enableForegroundBitmap()
                .build()

            val segmenter = SubjectSegmentation.getClient(options)

            segmenter.process(image)
                .addOnSuccessListener { result ->
                    val foregroundBitmap = result.foregroundBitmap
                    if (foregroundBitmap == null) {
                        promise.reject("NO_SUBJECT", "피사체를 찾을 수 없습니다.")
                        return@addOnSuccessListener
                    }

                    try {
                        val tmpDir = reactApplicationContext.cacheDir
                        val tmpFile = File.createTempFile("nucci_", ".png", tmpDir)
                        val outStream = FileOutputStream(tmpFile)
                        // PNG로 압축 (무손실이므로 100)
                        foregroundBitmap.compress(Bitmap.CompressFormat.PNG, 100, outStream)
                        outStream.flush()
                        outStream.close()

                        promise.resolve("file://${tmpFile.absolutePath}")
                    } catch (e: Exception) {
                        promise.reject("PROCESSING_FAILED", "이미지 저장 실패", e)
                    }
                }
                .addOnFailureListener { e ->
                    promise.reject("PROCESSING_FAILED", "누끼 처리 실패", e)
                }
        } catch (e: Exception) {
            promise.reject("LOAD_FAILED", "이미지 로드 실패", e)
        }
    }
}
