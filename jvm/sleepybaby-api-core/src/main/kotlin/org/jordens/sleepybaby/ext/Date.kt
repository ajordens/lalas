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

package org.jordens.sleepybaby.ext

import java.text.SimpleDateFormat
import java.util.*
import java.util.concurrent.TimeUnit

fun parseDate(format: String, input: String) : Date = SimpleDateFormat(format).parse(input)
fun formatDate(format: String, input: Date) : String = SimpleDateFormat(format).format(input)

fun Date.minus(days: Long): Date = Date(this.time - TimeUnit.DAYS.toMillis(days))

fun Date.yesterday(): Date = this.minus(1)
