<template>
  <div class="space-y-8">
    <div
        class="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-primary transition-colors"
        @dragover.prevent
        @drop.prevent="handleDrop"
        :class="{ 'border-primary': isDragging }"
        @dragenter="isDragging = true"
        @dragleave="isDragging = false"
    >
      <input
          type="file"
          ref="fileInput"
          class="hidden"
          accept="image/*"
          @change="handleFileSelect"
      />
      <div class="space-y-4">
        <div class="text-4xl text-gray-400">
          <span v-if="!preview">📸</span>
          <img
              v-else
              :src="preview"
              alt="Preview"
              class="max-h-64 mx-auto object-contain"
          />
        </div>
        <div class="space-y-2">
          <p class="text-gray-300">
            {{ preview ? 'Change image' : 'Drop your image here or' }}
          </p>
          <button
              @click="$refs.fileInput.click()"
              class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              :disabled="isProcessing"
          >
            {{ isProcessing ? 'Processing...' : 'Browse Files' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Processing Status -->
    <div v-if="isProcessing" class="text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      <p class="text-gray-300 mt-2">Processing your image...</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="text-red-500 text-center">
      {{ error }}
    </div>

    <!-- Result -->
    <div v-if="processedImage" class="space-y-4">
      <h3 class="text-xl font-semibold text-white">Result</h3>
      <div class="border-2 border-gray-600 rounded-lg p-4">
        <img
            :src="processedImage"
            alt="Processed Image"
            class="max-h-64 mx-auto object-contain"
        />
      </div>
      <div class="text-center">
        <a
            :href="processedImage"
            download="processed-image.png"
            class="inline-block px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
        >
          Download Result
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const preview = ref(null)
const processedImage = ref(null)
const isDragging = ref(false)
const isProcessing = ref(false)
const error = ref(null)
const fileInput = ref(null)

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    processFile(file)
  }
}

const processFile = async (file) => {
  if (file.type.startsWith('image/')) {
    // Show preview
    const reader = new FileReader()
    reader.onload = (e) => {
      preview.value = e.target.result
    }
    reader.readAsDataURL(file)

    // Process image
    try {
      isProcessing.value = true
      error.value = null
      processedImage.value = null

      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/remove-background', {
        method: 'POST',
        body: formData,
      })
      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to process image')
      }

      const blob = await response.blob()
      processedImage.value = URL.createObjectURL(blob)
    } catch (err) {
      error.value = 'Error processing image. Please try again.'
      console.error('Error:', err)
    } finally {
      isProcessing.value = false
    }
  } else {
    error.value = 'Please upload an image file'
  }
}
</script>

