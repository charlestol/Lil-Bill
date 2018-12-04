//
//  CustomVibrationManager.m
//  LilBill
//
//  Created by Miguel Hernandez on 12/3/18.
//  Copyright © 2018 Facebook. All rights reserved.
//


#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(CustomVibration, NSObject)

RCT_EXTERN_METHOD(vibrate:(NSString *)bill)

@end
