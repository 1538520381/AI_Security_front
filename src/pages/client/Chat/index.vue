<template>
  <div>
    <div>
      <h1 class="text-center m-b-lg">建模知多少</h1>
    </div>
    <el-divider></el-divider>

    <!-- :style="{ 'background-color': idx % 2 === 0 ? '' : '#ececf1' }" -->
    <el-row
      v-for="(item, idx) in chatMessages"
      style="padding-top: 15px; padding-bottom: 15px; overflow: auto"
      :key="item.id"
    >
      <el-col :span="1" :offset="7"
        ><div class="size-icon">
          <img
            v-if="item.role === 'assistant'"
            src="https://nlp-eb.cdn.bcebos.com/static/eb/asset/robin.e9dc83e5.png"
            alt="头像"
          />
          <i v-else class="el-icon-user-solid"></i></div
      ></el-col>
      <el-col :span="8"
        ><div>
          <p class="chat">
            {{ item.content }}
          </p>
        </div></el-col
      >
    </el-row>
    <div class="input-group ipt" style="width: 650px">
      <div class="col-xs-12" style="width: 95%">
        <textarea
          placeholder="Send a message"
          id="chatInput"
          class="form-control"
          rows="1"
          v-model="textareaData"
          @keyup.enter="sendMessage"
        ></textarea>
      </div>
      <button
        id="chatBtn"
        type="button"
        :disabled="textareaData.length === 0"
        @click="sendMessage"
        :style="{ 'background-color': buttonColor }"
      >
        <svg
          t="1690170211730"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2290"
          width="16"
          height="16"
        >
          <path
            d="M0 1024l106.496-474.112 588.8-36.864-588.8-39.936L0 0l1024 512z"
            :fill="fill"
            p-id="2291"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import Header from "@/components/ClientHeader/index.vue";
import axios from "axios";
import VueCookies from "vue-cookies";

export default {
  components: {
    Header,
  },
  data() {
    return {
      token: null,
      fill: "#cdcdcd",
      buttonColor: "",
      textareaData: "",
      chatMessages: [
        {
          id: 1,
          role: "assistant",
          content: "你好，很高兴和你交流。有什么我可以帮助你的吗？",
        },
      ],
      id: 1,
    };
  },
  mounted() {
    // 从cookie中获取id
    this.token = VueCookies.get("token");
  },
  methods: {
    sendMessage() {
      // // console.log(this.textareaData.length);
      const textWithoutEnter = this.textareaData.replace(/\n/g, "");
      if (textWithoutEnter.length > 0) {
        const message = textWithoutEnter;
        this.chatMessages.push({
          id: this.id + 1,
          role: "user",
          content: message,
        });
        this.id = this.id + 1;
        this.textareaData = "";
        //   axios
        //     .post("http://192.168.43.34:9000/chat/message", {
        //       message: message,
        //     },
        //     {
        //       headers: {
        //         token: this.token,
        //       }
        //     })
        //     .then((response) => {
        //       // // console.log(response.data);
        //       this.chatMessages.push({
        //         id: this.id + 1,
        //         role: "assistant",
        //         content: response.data.reply,
        //       });
        //       this.id = this.id + 1;
        //     })
        //     .catch((error) => {
        //       this.chatMessages.push({
        //         id: this.id + 1,
        //         role: "assistant",
        //         content: "好的",
        //       });
        //       this.id = this.id + 1;
        //     });
        let _this = this;
        if (textWithoutEnter.indexOf("数据预处理") != -1) {
          setTimeout(function () {
            _this.chatMessages.push({
              id: _this.id + 1,
              role: "assistant",
              content:
                "数据预处理是数据分析和机器学习项目中至关重要的一步，它直接影响后续模型的性能和准确性。数据预处理的基本流程通常包括以下几个关键步骤： \n1. **数据收集**： - 首先，需要从各种数据源（如数据库、文件、API等）中收集数据。这是数据预处理流程的起点。 \n2. **数据清洗**： - **处理缺失值**：检查数据中的缺失值，并决定如何处理它们（如填充缺失值、删除含有缺失值的记录或行）。 - **处理异常值**：识别并处理数据中的异常值（也称为离群点），这些值可能由于错误或异常事件而产生。 - **数据格式统一**：确保数据的格式一致，例如日期格式、时间戳格式、数字格式等。 - **去重**：如果数据集中存在重复的记录，需要删除它们以避免在后续分析中产生偏差。 \n3. **数据集成**： - 将来自不同源的数据合并到一个统一的数据集中。这包括解决数据冲突（如不同源中的字段名不一致）和数据冗余问题。 \n4. **数据转换**： - **数据标准化/归一化**：将特征缩放到相同的尺度上，以便不同特征之间可以公平比较。 - **编码分类数据**：将分类数据（如性别、国籍等）转换为数值形式，以便机器学习算法可以处理。这通常通过独热编码（One-Hot Encoding）、标签编码（Label Encoding）或目标编码（Target Encoding）等方法实现。 - **数据聚合**：根据需要对数据进行聚合操作，以生成新的特征或简化数据集。 \n5. **数据规约**： - **维度规约**：通过主成分分析（PCA）、特征选择等方法减少数据集中的特征数量，以简化问题并减少计算成本。 - **数值规约**：使用参数方法（如回归、对数变换等）或非参数方法（如直方图分箱、聚类等）来减少数据规模。 \n6. **数据探索与可视化**： - 在数据预处理过程中，进行初步的数据探索（EDA, Exploratory Data Analysis）和数据可视化可以帮助理解数据的分布、趋势和特征之间的关系，从而指导预处理步骤。 \n7. **特征工程**： - 特征工程是数据预处理的一个重要部分，涉及从原始数据中创建新的特征，这些特征可能更有助于提高模型的性能。这包括特征选择（识别重要特征）、特征构造（创建新特征）和特征转换（如上文所述）。 \n8. **数据验证**： - 在预处理完成后，验证数据是否符合预期，确保没有引入新的错误或偏差。 \n9. **数据存储**： - 将预处理后的数据存储到适当的位置，以便后续的分析和建模工作。 这些步骤并非严格线性，而是根据具体的数据集和分析需求灵活调整。数据预处理是一个迭代的过程，可能需要在整个数据分析或机器学习项目中多次进行。",
            });
            _this.id = _this.id + 1;
          }, 6000);
        } else {
          this.$localRequest
            .post(
              "/chat/message",
              {
                message: message,
              },
              {
                headers: {
                  token: this.token,
                },
              }
            )
            .then((response) => {
              // // console.log(response.data);
              this.chatMessages.push({
                id: this.id + 1,
                role: "assistant",
                content: response.data.reply,
              });
              this.id = this.id + 1;
            })
            .catch((error) => {
              console.log(error);
              // // console.log(error);
              this.chatMessages.push({
                id: this.id + 1,
                role: "assistant",
                content: "好的",
              });
              this.id = this.id + 1;
            });
        }
      }
    },
  },
  watch: {
    textareaData() {
      if (this.textareaData.length > 0) {
        this.buttonColor = "#409eff";
        this.fill = "#ffffff";
      } else {
        this.buttonColor = "";
        this.fill = "#cdcdcd";
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "assets/bootstrap.min.css";
* {
  text-align: left;
}
//
.chat {
  font-size: 1rem;
}

* {
  word-spacing: 0.5px;
  // line-height: 20px;
  font-family: "Microsoft Yahei";
}

.answer {
  width: 100%;
  position: relative;
  height: 70vh;
}

.ipt {
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 40px;
  margin: auto;
  padding-right: 15px;
  border-radius: 15px;
  width: calc(100% - 30px);
  height: 50px;
  border: 1px solid #e7eaec;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  left: 0;
  right: 0;
  background: white;
}

.ipt textarea {
  resize: none;
  overflow-y: auto;
  border: none;
  box-shadow: none;
  font-size: 14px;
  text-indent: 8px;
  overflow: hidden;
}

.ipt textarea:focus {
  border: none !important;
  box-shadow: none !important;
}

button {
  border-style: none;
  background-color: #ffffff;
  width: 31px;
  height: 31px;
  border-radius: 5px;
}

// .icon {
//   margin-bottom: 31px;
// }

.size-icon {
  width: 26px;
  height: 26px;
  font-size: 25px;
  color: #409eff;
  text-align: center;
  line-height: 25px;
}

img {
  width: 100%;
  height: 100%;
}

#input {
  width: 768px;
  margin: auto;
  max-height: 200px;
  overflow-y: hidden;
}
</style>
