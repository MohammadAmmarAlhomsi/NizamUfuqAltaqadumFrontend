<script>
    import { fetchCurrentTerm } from "$lib/sdk/pogram-term";
    import { onMount } from "svelte";
    import { fetchAvailableAttendanceDays } from "$lib/sdk/halqa";
    
    import Button from "../Button.svelte";
    import DropdownField from "../DropdownField.svelte";

    import dayjs from "dayjs";
    import "dayjs/locale/ar";

    dayjs.locale("ar");

    let { 
        halqa=$bindable(null), 
        onSubmit = (date) => {}, 
        onCancel = () => {}, 
        ...props 
    } = $props();

    let currentTerm = $state(null);
    let attendanceDays = $state([]);
    let dateOptions = $state([]);
    let selectedAttendanceDayId = $state('');
    let errorText = $state('');

    $effect(async () => {
        if (halqa != null) {
            attendanceDays = await fetchAvailableAttendanceDays(halqa.id);
            dateOptions = attendanceDays
                .map(day => { return { value: day.id, text: dayjs(day.date).format("dddd DD/MM/YYYY"), } })
                .splice(0, 10);
        } 
    });

    $effect(() => {
        let day = attendanceDays.find(d => d.id == selectedAttendanceDayId);
        console.log($state.snapshot(day));
    })

    function handleRegister() {
        if (!selectedAttendanceDayId) {
            errorText = "الرجاء تحديد تاريخ التسجيل";
            return;
        } 

        errorText = '';

        let day = attendanceDays.find(d => d.id == selectedAttendanceDayId);

        onSubmit(day);
    }

    function handleCancel() {
        onCancel();
    }
</script>

<div class="container">
    <h1>تسجيل الحضور</h1>

    <DropdownField label="التاريخ" bind:options={dateOptions} bind:value={selectedAttendanceDayId}></DropdownField>

    <div class="error-container">
        <p>{errorText}</p>
    </div>

    <div class="buttons-container">
        <Button onclick={handleRegister} width='100px' filled={true}>تسجيل</Button>
        <div style="width: 20px"></div>
        <Button onclick={handleCancel} width='100px' filled={false}>إلغاء</Button>
    </div>
</div>

<style>
    .error-container {
        display: flex;
        justify-content: center;
        align-items: center;
        color: red;
        height: 50px;
    }

    h1 {
        margin-bottom: 20px;
    }

    .container {
        background: white;
        border-radius: 25px;
        box-shadow: 0px 0px 30px 5px rgba(0, 0, 0, 0.2);
        text-align: center;
        padding: 15px;

    }

    .buttons-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
</style>