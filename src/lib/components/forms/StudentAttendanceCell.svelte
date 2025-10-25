<script>
    import Button from "../Button.svelte";
    import DropdownField from "../DropdownField.svelte";

    let { 
        studentAttendanceRecord = $bindable(null),
        onchange = (data) => {},
        onclick = (record) => {},
        onclickNotesIcon = () => {}
    , ...props } = $props();

    function handleClickNotesIcon() {
        onclickNotesIcon();
    }
</script>

<button 
    onclick={() => onclick(studentAttendanceRecord)}
    class="cell-item"
    class:attended={studentAttendanceRecord.status == 'Attended'}
    class:absence-with-excuse={studentAttendanceRecord.status == 'AbscentWithExecuse'}
    class:absence-without-excuse={studentAttendanceRecord.status == 'AbscentWithoutExecuse'}
    >
    <p>{studentAttendanceRecord.student.fullName}</p>
    <div style="height: 10px;"></div>

    <div
        class="notes-container"
        role='button' type='button' tabindex='0'
        onclick={(e) => { e.stopPropagation(); handleClickNotesIcon();}} 
        onkeydown={e => e.preventDefault()}>
        <img class="notes-icon" src="/icons/notes-icon.png" alt=""/>
    </div>

    <DropdownField 
        labelWidth='50px' inputMinWidth='100px' label='الحضور' options={[
            { value: 'Attended', text: 'حاضر' },
            { value: 'AbscentWithExecuse', text: 'غياب بعذر' },
            { value: 'AbscentWithoutExecuse', text: 'غياب بدون عذر' }
        ]} 
        alignment='center'
        zeroValue={null}
        onchange={() => onchange(studentAttendanceRecord.status)}
        bind:value={studentAttendanceRecord.status}/>

    <div style="height: 10px;"></div>
</button>

<style>
    .notes-container {
        position: absolute;
        left: 10px;
        top: 10px;
    }

    .notes-icon {
        height: 25px;
    }

    .cell-item {
        background: white;
        color: black;
        box-shadow: 0 5px 10px 0px rgba(0, 0, 0, 0.2);
        padding: 20px;
        border-radius: 15px;
        cursor: pointer;

        outline: none;
        border: none;

        position: relative;
    }

    .attended {
        background: rgb(203, 255, 206);
    }

    .absence-with-excuse {
        background: rgb(255, 225, 170);
    }

    .absence-without-excuse {
        background: rgb(255, 191, 191);
    }
</style>