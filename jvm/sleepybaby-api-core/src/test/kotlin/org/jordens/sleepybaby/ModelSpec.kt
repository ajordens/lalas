/*
 * Copyright 2017 Adam Jordens
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.jordens.sleepybaby

import org.jetbrains.spek.api.Spek
import org.jetbrains.spek.api.dsl.describe
import org.jetbrains.spek.api.dsl.it
import org.junit.jupiter.api.Assertions

object FeedingSummaryByDaySpec : Spek({
  describe("feeding summary by day") {
    val summary = FeedingSummaryByDay("2017-01-01", 7, 290, 10, 0)

    it("should convert milkVolumeTotalMilliliters to ounces") {
      Assertions.assertEquals(9.8, summary.milkVolumeTotalOunces)
    }

    it("should convert milkVolumeAverageMilliliters to ounces") {
      Assertions.assertEquals(1.4, summary.milkVolumeAverageOunces)
    }

    it("should calculate milkVolumeAverageMilliliters") {
      Assertions.assertEquals(41, summary.milkVolumeAverageMilliliters)
    }
  }
})
