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

import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties(
  FeedingConfigurationProperties::class,
  JWTConfigurationProperties::class
)
class Main {
  @Bean
  fun feedingDataSource(feedingConfigurationProperties: FeedingConfigurationProperties): FeedingDataSource {
    return FeedingDataSource(feedingConfigurationProperties.sourceAsUrl())
  }
}

@Configuration
class MainConfiguration @Autowired constructor(val feedingDataSource: FeedingDataSource)  {
  @Scheduled(fixedRate = 300000)
  fun refreshFeedingDataSource() = feedingDataSource.refresh()
}

fun main(args: Array<String>) {
  SpringApplication.run(Main::class.java, *args)
}
