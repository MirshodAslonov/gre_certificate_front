<template>
  <div class="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
    <!-- Header -->
    <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
      GRE Physics Subject Test
    </h1>

    <!-- Timer -->
    <div class="mb-4 text-lg font-semibold text-gray-700">
      Time Left: {{ minutes }}:{{ seconds }}
    </div>

    <!-- Progress Bar -->
    <div class="w-full max-w-xl bg-gray-300 rounded-full h-4 mb-6">
      <div
        class="bg-blue-500 h-4 rounded-full"
        :style="{ width: progressPercentage + '%' }"
      ></div>
    </div>

    <!-- Question Card -->
    <div class="w-full max-w-xl bg-white rounded-2xl shadow p-6 mb-6">
      <div class="text-lg font-medium mb-4">
        Q{{ currentQuestionIndex + 1 }}: {{ currentQuestion.question }}
      </div>

      <div class="flex flex-col space-y-3">
        <button
          v-for="(option, index) in currentQuestion.options"
          :key="index"
          class="border rounded-lg p-3 text-left hover:bg-blue-100 focus:bg-blue-200 transition"
          :class="{
            'bg-green-200': selectedOption === index && isCorrect === true,
            'bg-red-200': selectedOption === index && isCorrect === false
          }"
          @click="selectOption(index)"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex space-x-4">
      <button
        class="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
        @click="prevQuestion"
        :disabled="currentQuestionIndex === 0"
      >
        Previous
      </button>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        @click="nextQuestion"
        :disabled="currentQuestionIndex === questions.length - 1"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timer: 60 * 3, // 3 minutes example, keyin o'zgartirish mumkin
      intervalId: null,
      currentQuestionIndex: 0,
      selectedOption: null,
      isCorrect: null,
      questions: [
        {
          question: "Newton's second law is?",
          options: ["F = ma", "E = mc^2", "V = IR", "pV = nRT"],
          answer: 0,
        },
        {
          question: "Photon has mass?",
          options: ["Yes", "No", "Depends", "Unknown"],
          answer: 1,
        },
        // Shu tarzda 70 ta savol qo'shish mumkin
      ],
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    progressPercentage() {
      return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
    },
    minutes() {
      return Math.floor(this.timer / 60)
        .toString()
        .padStart(2, "0");
    },
    seconds() {
      return (this.timer % 60).toString().padStart(2, "0");
    },
  },
  methods: {
    selectOption(index) {
      this.selectedOption = index;
      this.isCorrect = index === this.currentQuestion.answer;
    },
    nextQuestion() {
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++;
        this.selectedOption = null;
        this.isCorrect = null;
      }
    },
    prevQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--;
        this.selectedOption = null;
        this.isCorrect = null;
      }
    },
    startTimer() {
      this.intervalId = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.intervalId);
          alert("Time is up!");
        }
      }, 1000);
    },
  },
  mounted() {
    this.startTimer();
  },
};
</script>

<style scoped>
</style>
