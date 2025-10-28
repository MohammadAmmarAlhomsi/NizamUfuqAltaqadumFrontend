<script>
  import { stopPropagation } from "svelte/legacy";
  import Button from "../Button.svelte";

  let { 
      studentAttendanceRecord = $bindable(null),
      onchange = (data) => {},
      onclick = (record) => {},
      onclickNotesIcon = () => {}
  , ...props } = $props();

  function handleClickNotesIcon() {
      onclickNotesIcon();
  }

  const attendanceOptions = [
      { value: 'Attended', text: 'حاضر', color: 'rgb(70, 190, 90)' },
      { value: 'AttendedLate', text: 'حاضر متأخر', color: 'rgb(35, 95, 45)' },
      { value: 'AbscentWithExecuse', text: 'غياب بعذر', color: 'rgb(255, 200, 80)' },
      { value: 'AbscentWithoutExecuse', text: 'غياب بدون عذر', color: 'rgb(255, 100, 100)' }
  ];

  function selectStatus(value) {
      studentAttendanceRecord.status = value;
      onchange(value);
  }
</script>

<button 
    onclick={() => onclick(studentAttendanceRecord)}
    class="cell-item"
    class:attended={studentAttendanceRecord.status == 'Attended'}
    class:absence-with-excuse={studentAttendanceRecord.status == 'AbscentWithExecuse'}
    class:absence-without-excuse={studentAttendanceRecord.status == 'AbscentWithoutExecuse'}
    class:attended-late={studentAttendanceRecord.status == 'AttendedLate'}
>
    <p class="student-name">{studentAttendanceRecord.student.fullName}</p>

    <div
        class="notes-container"
        role='button' type='button' tabindex='0'
        onclick={(e) => { e.stopPropagation(); handleClickNotesIcon();}} 
        onkeydown={e => e.preventDefault()}>
        <img class="notes-icon" src="/icons/notes-icon.png" alt=""/>
    </div>

    <!-- Open attendance options -->
    <div 
            class="attendance-options" 
            onclick={e => e.stopPropagation()}
            onkeydown={() => {}}
            tabindex = '0'
            role='button'>
        {#each attendanceOptions as opt}
            <div 
                role="button"
                tabindex="0"
                class="attendance-button"
                onkeydown={() => { }}
                class:selected={studentAttendanceRecord.status === opt.value}
                style="--accent-color: {opt.color};"
                onclick={(e) => { e.stopPropagation(); selectStatus(opt.value); } }>
                {opt.text}
            </div>
        {/each}
    </div>
</button>

<style>
  .cell-item {
      background: white;
      color: black;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      padding: 18px;
      border-radius: 16px;
      cursor: pointer;
      outline: none;
      border: none;
      position: relative;
      text-align: center;
      transition: box-shadow 0.2s ease;
  }

  .cell-item:hover {
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  }

  .student-name {
      font-weight: 600;
      font-size: 1.1rem;
      color: #333;
      margin-bottom: 10px;
  }

  .notes-container {
      position: absolute;
      left: 10px;
      top: 10px;
  }

  .notes-icon {
      height: 24px;
      opacity: 0.85;
      transition: transform 0.2s;
  }

  .notes-icon:hover {
      transform: scale(1.1);
  }

  .attendance-options {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
  }

  .attendance-button {
      padding: 8px 14px;
      border-radius: 999px;
      background: rgba(0, 0, 0, 0.05);
      border: 1px solid transparent;
      font-weight: 500;
      color: #333;
      cursor: pointer;
      transition: all 0.25s ease;
      user-select: none;
  }

  .attendance-button:hover {
      background: rgba(0, 0, 0, 0.08);
  }

  .attendance-button.selected {
      background: var(--accent-color);
      border-color: var(--accent-color);
      color: white;
      box-shadow: 0 0 8px var(--accent-color);
  }

  /* Card background colors based on state */
  .attended {
      background: rgb(230, 255, 232);
  }

  .attended-late {
    background: rgb(201, 231, 207);
  }
  
  .absence-with-excuse {
      background: rgb(255, 247, 220);
  }

  .absence-without-excuse {
      background: rgb(255, 230, 230);
  }
</style>
