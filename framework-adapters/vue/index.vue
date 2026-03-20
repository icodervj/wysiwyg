<template>
  <div ref="container"></div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted, watch } from 'vue';

export default defineComponent({
  name: 'WysiwygEditor',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    plugins: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'Start writing...'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit, expose }) {
    const container = ref(null);
    let editor = null;

    onMounted(async () => {
      const { Editor } = await import('@wysiwyg/editor-core');

      editor = new Editor({
        element: container.value,
        plugins: props.plugins,
        placeholder: props.placeholder,
      });

      if (props.modelValue) {
        editor.setHTML(props.modelValue);
      }

      editor.on('change', ({ html }) => {
        emit('update:modelValue', html);
      });
    });

    onUnmounted(() => {
      if (editor) editor.destroy();
    });

    watch(() => props.modelValue, (val) => {
      if (editor && val !== editor.getHTML()) {
        editor.setHTML(val);
      }
    });

    expose({
      getHTML: () => editor?.getHTML(),
      getJSON: () => editor?.getJSON(),
      exec: (cmd, opts) => editor?.exec(cmd, opts),
      undo: () => editor?.undo(),
      redo: () => editor?.redo(),
    });

    return { container };
  }
});
</script>
