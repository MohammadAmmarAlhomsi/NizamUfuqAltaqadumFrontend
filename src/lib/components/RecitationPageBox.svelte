<script>
    let { 
        quranPage = $bindable({}), 
        studentAttendanceRecord = $bindable({}),
        onclick = () => { },
        ...props 
    } = $props();

    function isSameUTCDate(d1, d2) {
        return (
            d1.getUTCFullYear() === d2.getUTCFullYear() &&
            d1.getUTCMonth() === d2.getUTCMonth() &&
            d1.getUTCDate() === d2.getUTCDate()
        );
    }
</script>

<button 
    {onclick} 
    class="recitation-page"
    class:is-highlighted={quranPage.isHighlighted}
    class:is-recited={quranPage.isRecited && !quranPage.isRecitationCancelled}
    class:is-cancelled={quranPage.isRecitationCancelled}
    class:is-recited-today={quranPage.studentAttendanceRecordId == studentAttendanceRecord.id && !quranPage.isRecitationCancelled}
    class:is-cancelled-today={quranPage.studentAttendanceRecordId == studentAttendanceRecord.id && quranPage.isRecitationCancelled}
    >
    {quranPage.number}
    <p class="order-label">{quranPage?.order}</p>
</button>

<style>
    button {
        position: relative;
        transition: all ease-in-out 0.3s;

    }

    button:hover {
        transform: scale(1.1);
    }

    p {
        position: absolute;
        bottom: 0px;
        left: 50%;
        transform: translate(-50%, 0px);
        font-size: 10px;
    }

    .recitation-page {
        background: white;
        padding: 12px;
        box-shadow: 0px 5px 8px 0px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        border: none;
        outline: none;
        cursor: pointer;
    }

    .is-highlighted {
        background: yellow;
        transform: scale(1.1);
    }

    .is-cancelled {
        background: rgb(255, 161, 161);
    }

    .is-recited {
        background: rgb(190, 255, 190);
    }

    /* .is-cancelled-today {
        transform: scale(1.0);
    } */

    .is-recited-today {
        /* transform: scale(1.0); */
        background: rgb(121, 255, 121);
    }
</style>