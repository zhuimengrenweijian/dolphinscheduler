/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { defineComponent, PropType } from 'vue'
import { NCard } from 'naive-ui'

const headerStyle = {
  borderBottom: '1px solid var(--n-border-color)',
}

const contentStyle = {
  padding: '8px 10px',
}

const props = {
  title: {
    type: String as PropType<string>,
    required: true,
  },
}

const Card = defineComponent({
  name: 'Card',
  props,
  render() {
    const { title, $slots } = this
    return (
      <NCard
        title={title}
        size='small'
        headerStyle={headerStyle}
        contentStyle={contentStyle}
      >
        {$slots}
      </NCard>
    )
  },
})

export default Card
