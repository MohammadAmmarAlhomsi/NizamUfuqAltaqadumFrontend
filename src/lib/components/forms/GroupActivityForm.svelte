<script>
  import { addGroupActivities } from "$lib/sdk/halqa";
  import Button from "../Button.svelte";
  import FormInputField from "../FormInputField.svelte";
  import TextAreaField from "../TextAreaField.svelte";

  let {
    show = $bindable(false),
    halqa = $bindable(null),
    onCreateActivity = () => { },
    ...props
  } = $props();

  let students = $state([]);
  let activityName = $state("");
  let notes = $state("");
  let studentWeights = $state({}); // { studentId: weight }
  let errorText = $state("");

  // Load students when halqa changes
  $effect(() => {
    if (halqa != null) {
      students = halqa.students ?? [];
    }
  });

  // Initialize student weights when students are loaded
  $effect(() => {
    if (halqa && Object.keys(studentWeights).length === 0) {
      halqa.students.forEach(s => studentWeights[s.id] = 0);
    }
  });

  /**
   * Validate form fields
   */
  function validateInput() {
    if (!activityName || activityName.trim().length === 0) {
      errorText = "يرجى إدخال اسم النشاط.";
      return false;
    }

    const hasAnyPoints = Object.values(studentWeights).some(v => Number(v) > 0);
    if (!hasAnyPoints) {
      errorText = "يرجى إدخال نقاط لطالب واحد على الأقل.";
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
   * Register the group activity (multiple students)
   */
  async function handleRegister() {
    if (!validateInput()) return;

    const activities = Object.entries(studentWeights)
      .filter(([_, weight]) => Number(weight) > 0)
      .map(([studentId, weight]) => ({
        name: activityName,
        studentId,
        notes,
        weight: Number(weight),
      }));

    const dto = {
      halqaId: halqa.id,
      name: activityName,
      notes,
      weights: activities.map(a => ({ studentId: a.studentId, weight: a.weight }))
    };

    try {
      const result = await addGroupActivities(dto);

      if (result === null) {
        errorText = "فشل في إضافة النشاط الجماعي. تحقق من الاتصال أو الصلاحيات.";
        return;
      }

      // Reset form
      activityName = "";
      notes = "";
      for (const id in studentWeights) studentWeights[id] = 0;
      show = false;
    } catch (err) {
      console.error("Error registering group activity:", err);
      errorText = "حدث خطأ أثناء تسجيل النشاط الجماعي.";
    }

    onCreateActivity();
  }

  function handleCancel() {
    show = false;
  }
</script>

{#if halqa != null}
  <div class="container">
    <h1>تسجيل نشاط جماعي</h1>

    <div style="height: 25px;"></div>

    <FormInputField bind:value={activityName} label="اسم النشاط" />
    <div style="height: 20px;"></div>

    <h3 style="margin-bottom: 10px;">الطلاب والنقاط:</h3>
    <div class="students-container">
      {#each students as student}
        <div class="student-row">
          <span class="student-name">{student.fullName}</span>
          <input
            type="number"
            min="0"
            placeholder="0"
            bind:value={studentWeights[student.id]}
            class="points-input"
          />
        </div>
      {/each}
    </div>

    <div style="height: 25px;"></div>

    <TextAreaField bind:value={notes} label="الملاحظات" />
    
    <div style="height: 15px;"></div>
    <p style="color: red; text-align: center; height: 30px">{errorText}</p>
    <div style="height: 15px;"></div>

    <div class="buttons-container">
      <Button onclick={handleRegister} width="100px" filled={true}>تسجيل</Button>
      <div style="width: 20px;"></div>
      <Button onclick={handleCancel} width="100px" filled={false}>إلغاء</Button>
    </div>
  </div>
{:else}
  <p>لا توجد بيانات للحلقة.</p>
{/if}

<style>
  h1 {
    text-align: center;
  }

  .container {
    background: white;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.4);
    border-radius: 15px;
    padding: 20px;
  }

  .students-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 250px;
    overflow-y: auto;
    border-radius: 10px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    padding: 10px;
  }

  .student-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fafafa;
    padding: 6px 10px;
    border-radius: 8px;
  }

  .student-name {
    font-size: 14px;
    font-weight: 500;
  }

  .points-input {
    width: 70px;
    border: none;
    border-radius: 8px;
    box-shadow: 0px 2px 3px rgba(0, 0, 0, 0.12);
    padding: 4px 6px;
    text-align: center;
    outline: none;
  }

  .buttons-container {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
</style>
