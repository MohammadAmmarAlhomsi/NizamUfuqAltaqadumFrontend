<script>
  import GroupActivityForm from "./forms/GroupActivityForm.svelte";
  import GroupActivityRecordViewer from "./GroupActivityRecordViewer.svelte";

  let { 
    halqa = $bindable(null),
    activityRecord,
    onDelete = () => { }, 
    onclick = (recrd) => { }
  } = $props();

  let studentsCount = $state(0);
  let showGroupActivityForm = $state(false);

  function handleClick() {
    showGroupActivityForm = true;
    onclick(activityRecord);
  }

  $effect(() => {
    studentsCount = activityRecord?.activities?.filter(a => a.weight > 0).length ?? 0;
  });
</script>

<button class="group-activity-item" onclick={handleClick}>
  <p class="activity-name">{activityRecord?.name ?? "—"}</p>
  <p class="students-count">عدد الطلاب المشاركين: {studentsCount}</p>
  <p class="activity-date">{activityRecord?.createdAt ? new Date(activityRecord.createdAt).toLocaleDateString("ar") : "—"}</p>
</button>

{#if showGroupActivityForm}
    <div class="overlay">
        <GroupActivityRecordViewer 
          bind:groupActivity={activityRecord}
          bind:show={showGroupActivityForm}
          {onDelete}/>
    </div>
{/if}

<style>
.group-activity-item {
  background: white;
  color: black;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  padding: 20px;
  border-radius: 15px;
  cursor: pointer;
  outline: none;
  border: none;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
}

.group-activity-item:hover {
  transform: scale(1.01);
  box-shadow: 0 8px 14px rgba(0, 0, 0, 0.2);
}

.activity-name {
  font-weight: bold;
  font-size: 16px;
}

.activity-date,
.students-count {
  font-size: 14px;
  color: #444;
}

.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(2px);
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

