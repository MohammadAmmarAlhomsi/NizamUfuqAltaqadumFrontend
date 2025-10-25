<script>
  import Button from "../Button.svelte";
  import TextAreaField from "../TextAreaField.svelte";
  import FormInputField from "../FormInputField.svelte";
  import { registerJuzuAssessment } from "$lib/sdk/juzu-assessment";

  let {
    show = $bindable(false),
    student = $bindable(null),
    number = $bindable(1),
    onSuccess = () => {},
    onCancel = () => {},
    ...props
  } = $props();

  let notes = $state("");
  let mark = $state("");
  let errorText = $state("");

  function validateInput() {
    if (!mark || isNaN(mark) || Number(mark) < 0) {
      errorText = "يرجى إدخال علامة صحيحة بين 0.";
      return false;
    }
    errorText = "";
    return true;
  }

  async function handleRegister() {
    if (!validateInput()) return;

    try {
      const dto = {
        studentId: student.id,
        juzuNumber: number,
        grade: Number(mark),
        notes
      };

      const createdAssessment = await registerJuzuAssessment(dto);

      // Reset form
      notes = "";
      mark = "";
      show = false;

      onSuccess(createdAssessment);
    } catch (e) {
      errorText = e.message || "حدث خطأ أثناء تسجيل التقييم.";
    }
  }

  function handleCancel() {
    show = false;
    onCancel();
  }
</script>

{#if show && student != null}
  <div class="overlay">
    <div class="modal" role="button" tabindex="0" onkeydown={() => {}} onclick={(e) => e.stopPropagation()}>
      <h1>تسجيل تقييم الجزء {number}</h1>
      <p class="student-name">الطالب: {student.fullName}</p>

      <FormInputField bind:value={mark} label="العلامة" type="number" />
      <div style="height: 15px;"></div>

      <TextAreaField bind:value={notes} label="الملاحظات" />
      <div style="height: 10px;"></div>

      <p class="error-text">{errorText}</p>

      <div class="buttons-container">
        <Button onclick={handleRegister} width="100px" filled={true}>تسجيل</Button>
        <Button onclick={handleCancel} width="100px" filled={false}>إلغاء</Button>
      </div>
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }

  .modal {
    background: white;
    border-radius: 15px;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
    padding: 25px 30px;
    width: 400px;
    max-width: 90%;
    position: absolute;
  }

  h1 {
    text-align: center;
    margin-bottom: 10px;
  }

  .student-name {
    text-align: center;
    font-weight: 500;
    margin-bottom: 15px;
  }

  .error-text {
    color: red;
    text-align: center;
    height: 24px;
  }

  .buttons-container {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 15px;
  }
</style>
