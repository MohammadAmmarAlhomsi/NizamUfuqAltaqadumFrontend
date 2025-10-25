<script>
  import { addIndividualActivity } from "$lib/sdk/halqa";
  import Button from "../Button.svelte";
  import DropdownField from "../DropdownField.svelte";
  import FormInputField from "../FormInputField.svelte";
  import TextAreaField from "../TextAreaField.svelte";

  let {
    show = $bindable(false),
    halqa = $bindable(null),
    ...props
  } = $props();

  let students = $state([]);
  let activityName = $state("");
  let studentId = $state("");
  let notes = $state("");
  let weight = $state(0);
  let errorText = $state("");

  // Load students when halqa changes
  $effect(() => {
    if (halqa != null) {
      students = halqa.students;
    }
  });

  /**
   * Validates the user input for creating a student activity.
   * @returns {boolean} true if valid, false otherwise (and sets errorText)
   */
  function validateInput() {
    if (!activityName || activityName.trim().length === 0) {
      errorText = "يرجى إدخال اسم النشاط.";
      return false;
    }

    if (!studentId) {
      errorText = "يرجى اختيار الطالب.";
      return false;
    }

    if (isNaN(weight) || weight <= 0) {
      errorText = "يرجى إدخال عدد النقاط (رقم موجب).";
      return false;
    }

    if (notes.trim().length > 500) {
      errorText = "الملاحظات طويلة جدًا (الحد الأقصى 500 حرف).";
      return false;
    }

    errorText = "";
    return true;
  }

  /**
   * Handles registration of an individual activity.
   * Validates form inputs, sends the request, and closes the dialog on success.
   */
  async function handleRegister() {
    if (!validateInput()) return;

    try {
      const result = await addIndividualActivity({
        name: activityName,
        studentId: studentId,
        notes: notes,
        weight: Number(weight),
      });

      if (result === null) {
        errorText = "فشل في إضافة النشاط. تحقق من الاتصال أو الصلاحيات.";
        return;
      }

      // Reset form and close modal
      activityName = "";
      studentId = "";
      notes = "";
      weight = 0;
      show = false;
    } catch (err) {
      console.error("Error registering activity:", err);
      errorText = "حدث خطأ أثناء تسجيل النشاط.";
    }
  }

  function handleCancel() {
    show = false;
  }
</script>


{#if halqa != null}
    <div class="container">
        <h1>تسجيل نشاط فردي</h1>

        <div style="height: 25px;"></div>

        <FormInputField bind:value={activityName} label='اسم النشاط'/>
        <div style="height: 15px;"></div>
        <DropdownField bind:value={studentId} label='اسم الطالب' options={students.map(s => { return { text: s.fullName, value: s.id } })}/>
        <div style="height: 15px;"></div>
        <FormInputField bind:value={weight} type='number' label='عدد النقاط'/>
        <div style="height: 30px;"></div>
        <TextAreaField bind:value={notes} label='الملاحظات'/>
        <div style="height: 30px;"></div>

        <p style="color: red; text-align: center; height: 30px">{errorText}</p>

        <div style="height: 10px;"></div>

        <div class="buttons-container">
            <Button onclick={handleRegister} width='100px' filled={true}>تسجيل</Button>
            <div style="width: 20px"></div>
            <Button onclick={handleCancel} width='100px' filled={false}>إلغاء</Button>
        </div>
    </div>
{:else}
    <p>الطالب لا يوجد</p>
{/if}

<style>
    h1 {
        text-align: center;
    }

    .container {
        background: white;
        box-shadow: 0px 0px 20px 0px rgba(0,0,0,0.4);
        border-radius: 15px;
        padding: 20px
    }

    .buttons-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
</style>