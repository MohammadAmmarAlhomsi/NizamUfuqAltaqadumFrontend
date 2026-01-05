<script>
    import FormInputField from "../FormInputField.svelte";
    import TextAreaField from "../TextAreaField.svelte";
    import Button from "../Button.svelte";
    import DateField from "../DateField.svelte";
    import DropdownField from "../DropdownField.svelte";

    import { retrieveInstructors } from "$lib/sdk/instructor";
    import { onMount } from "svelte";

    let { submitButtonText='إرسال', onsubmit = (data) => { }, data = $bindable({
        name: '',
        instructorId: '',
        instructor: null
    }), errorText = $bindable(''), ...props } = $props(); 

    let instructors = $state([]);

    $effect(() => {
        data.instructor = instructors.find(inst => inst.id == data.instructorId);
    })

    onMount(async () => {
        try {
            instructors = await retrieveInstructors();
            console.log($state.snapshot(instructors));
        } catch (e) {
            console.error(`Unable to load instructors: ${e}`)
        }
    })

    function validate() {
        if (!data.name || data.name.trim() === "") {
            return "يرجى إدخال اسم الحلقة";
        }

        if (!data.instructor) {
            return "يرجى اختيار اسم الأستاذ";
        }

        if (!data.halqaDay) {
            return "يرجى تحديد يوم الحلقة"
        }

        return "";
    }

    function handleSubmit() {
        const error = validate();

        if (error) {
            errorText = error;
            return;
        }

        errorText = '';

        onsubmit(data);
    }
</script>

<div class="container">
    <div class="row">
        <FormInputField label='اسم الحلقة' bind:value={data.name}/>
        <DropdownField label='اسم الأستاذ' bind:value={data.instructorId} options={instructors.map(inst => { return { value: inst.id, text: inst.fullName } })}/>
    </div>
    <div class="row">
        <DropdownField label='اليوم' bind:value={data.halqaDay} options={[ { value: 'Saturday', text: 'السبت' }, { value: 'Sunday', text: 'الأحد' } ]}/>
    </div>
    <div class="row notes">
        <TextAreaField label='الملاحظات' bind:value={data.notes}/>
    </div>
    <div class='row actions'>
        <p class="error-text">{errorText}</p>
        <div style="flex: 1;"></div>
        <Button onclick={handleSubmit}>{submitButtonText}</Button>
    </div>
</div>

<style>
    .row {
        display: flex;
        flex-direction: row;
        gap: 16px;
        width: 100%;
        flex-wrap: wrap;
        margin-bottom: 20px;
    }

    .notes {
        height: auto;
    }

    .error-text {
        height: 30px;
        margin: 10px 0px;
        color: red;
    }

    .actions {
        align-items: center;
    }

    @media (max-width: 768px) {
        .row {
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
        }
    }
</style>
