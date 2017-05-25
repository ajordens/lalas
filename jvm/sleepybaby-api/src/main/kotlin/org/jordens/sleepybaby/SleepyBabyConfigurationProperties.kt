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

import org.springframework.boot.context.properties.ConfigurationProperties
import java.net.URL

@ConfigurationProperties(prefix = "feedings")
data class FeedingsConfigurationProperties(var source: String = "", var name: String = "") {
  fun sourceAsUrl() = URL(source)
}

@ConfigurationProperties(prefix = "jwt")
data class JWTConfigurationProperties(var secret: String = "", var expiration: Int = 0)
