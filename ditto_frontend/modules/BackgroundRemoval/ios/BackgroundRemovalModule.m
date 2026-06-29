#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(BackgroundRemovalModule, NSObject)

RCT_EXTERN_METHOD(
    removeBackground:(NSString *)imageUri
    resolver:(RCTPromiseResolveBlock)resolve
    rejecter:(RCTPromiseRejectBlock)reject
)

@end
