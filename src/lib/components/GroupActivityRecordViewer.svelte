<script>
  import { deleteGroupActivity } from "$lib/sdk/halqa";

  let {
    groupActivity = $bindable(null), // GroupActivityRecord
    onclick = $bindable((record) => {}),
    onDelete = $bindable((record) => {}),
    onClose = $bindable(() => {}),
    show = $bindable(false)
  } = $props();

  let participants = $state([]);
  // Update participants whenever groupActivity changes
  $effect(() => {
    participants = groupActivity?.activities ?? [];
  });

  async function handleDelete(e) {
    show = false;
    e.stopPropagation();
    
    try {
      await deleteGroupActivity(groupActivity.id);
      console.log('grop activity is deleted.');
    } catch(e) {
      console.error(e);
      alert('حدث خطأ أثناء حذف النشاط الجماعي.')
    }

    onDelete(groupActivity);
  }

  function handleClose(e) {
    show = false;
    e.stopPropagation();
    onClose();
  }
</script>

<div class="group-activity-card">
  <div class="card-header">
    <div class="activity-info">
      <h2 class="activity-name">{groupActivity?.name ?? "—"}</h2>
      <span class="activity-date">
        {groupActivity?.happenedAt ? new Date(groupActivity.happenedAt).toLocaleDateString("ar") : "—"}
      </span>
      {#if groupActivity?.notes && groupActivity.notes.trim().length > 0}
        <p class="activity-notes">📝 {groupActivity.notes}</p>
      {/if}
    </div>
    <div class="activity-actions">
      <button class="menu-btn close-btn" onclick={handleClose} title="إغلاق">✖</button>
      <button class="menu-btn delete-btn" onclick={handleDelete} title="حذف">🗑</button>
    </div>
  </div>

    <div class="participants-container">
      {#if participants.length > 0}
          {#each participants as p}
              <div class="participant-row">
                  <span class="student-name">{p.student?.fullName ?? "—"}</span>
                  <span class="weight">النقاط المضافة: {p.weight}</span>
              </div>
          {/each}
      {:else}
          <p class="no-participants">لا يوجد طلاب مشاركين بعد.</p>
      {/if}
  </div>
</div>

<style>
.group-activity-card {
  background: linear-gradient(145deg, #e6e6e6, #ffffff);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  margin-bottom: 25px;
  max-width: 600px;
  width: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.group-activity-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 25px rgba(0,0,0,0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.activity-info {
  cursor: pointer;
}

.activity-name {
  font-size: 20px;
  font-weight: bold;
  margin: 0;
  color: #1b2a41;
}

.activity-date {
  font-size: 14px;
  color: #64748b;
  margin-top: 4px;
  display: block;
}

.activity-notes {
  background: #ffffffcc;
  color: #334155;
  padding: 6px 10px;
  border-radius: 8px;
  margin-top: 8px;
  font-size: 14px;
  max-width: 400px;
}

.activity-actions {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.menu-btn {
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background 0.2s ease;
}

.close-btn {
  background: #ffffff;
  color: #1e293b;
}

.close-btn:hover {
  background: #cccccc;
}

.delete-btn {
  background: #f87171;
  color: white;
}

.delete-btn:hover {
  background: #ef4444;
}

.participants-container {
  margin-top: 15px;
  border-top: 1px solid #cbd5e1;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  /* scrollable */
  max-height: calc((8px + 8px + 12px + 8px) * 8); /* rough calculation per row */
  overflow-y: auto;
  scrollbar-width: thin;
}

.participants-container::-webkit-scrollbar {
  width: 6px;
}

.participants-container::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

.participant-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0,0,0,0.05);
}

.student-name {
  font-weight: 500;
  color: #1e293b;
}

.weight {
  font-weight: 500;
  color: #334155;
}

.no-participants {
  text-align: center;
  color: #64748b;
  font-style: italic;
}
</style>
