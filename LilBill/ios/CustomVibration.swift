//
//  CustomVibration.swift
//  LilBill
//
//  Created by Miguel Hernandez on 12/3/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import AudioToolbox.AudioServices

@objc(CustomVibration)
class CustomVibration: NSObject {
  
  static var ONE_SECOND: Double {
    return 1000000
  }
  
  static var SLEEP_TIME: Double {
    return 0.5
  }
  
  @objc(vibrate:)
  func vibrate(bill: String) -> Void {
    var choice: UInt32 = 0
    switch bill {
    case "1":
      choice = SystemSoundID(kSystemSoundID_Vibrate)
      AudioServicesPlaySystemSound(choice)
      return
    case "5":
      choice = SystemSoundID(1011)
      AudioServicesPlaySystemSound(choice)
      return
    case "10":
      choice = SystemSoundID(1011)
      AudioServicesPlaySystemSoundWithCompletion(choice, {
        usleep(useconds_t(CustomVibration.SLEEP_TIME * CustomVibration.ONE_SECOND))
        AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)
      })
      return
    case "20":
      choice = SystemSoundID(1011)
      AudioServicesPlaySystemSoundWithCompletion(choice, {
        usleep(useconds_t(CustomVibration.SLEEP_TIME * CustomVibration.ONE_SECOND))
        AudioServicesPlaySystemSound(SystemSoundID(1011))
      })
    default:
      return
    }
  }
}
