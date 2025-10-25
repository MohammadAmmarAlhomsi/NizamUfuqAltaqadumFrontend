<script>
    import FormInputField from "../FormInputField.svelte";
    import TextAreaField from "../TextAreaField.svelte";
    import Button from "../Button.svelte";
    import DateField from "../DateField.svelte";
    import DropdownField from "../DropdownField.svelte";

    import { onMount } from "svelte";
    import { retrieveAllHalqat } from "$lib/sdk/halqa";
    import { fetchResponsibleHalqat } from "$lib/sdk/instructor";

    let { submitButtonText='إرسال', onsubmit = (data) => { }, data = $bindable({
        fullName: '', fatherName: '', motherName: '',
        nationality: '', school: '', phoneNumber: '',
        fatherPhoneNumber: '', motherPhoneNumber: '', fatherWork: '',
        motherWork: '', birthYear: 2000, emirate: '',
        region: '', halqaId: '', notes: ''
    }), ...props } = $props(); 

    let birthOptions = $state([]);

    let errorText = $state('');

    let halqat = $state([]);
    let halqatOptions = $state([]);

    async function loadHalqat() {
        try { return await retrieveAllHalqat(); } catch { }

        try {
            return await fetchResponsibleHalqat()
        } catch (e) {
            throw e;
        }
    }

    onMount(async () => {

        let yearsCount = 25;
        let currentYear = new Date().getFullYear();
        birthOptions = Array.from({length: yearsCount}, (_, i) => {
            return { 
                text: currentYear - i, 
                value: currentYear - i 
            }
        })

        console.log("birth options", $state.snapshot(birthOptions));

        try {
            halqat = await loadHalqat();
            halqatOptions = halqat.map(halqa => { return { value: halqa.id, text: halqa.name } });
        } catch (e) {
            errorText = e;
            console.error("Unable to load halqat: ", e);
        }
    });

    function validate() {
        if (!data.fullName || data.fullName.length < 3) return "اسم الطالب يجب أن يكون 3 أحرف على الأقل";
        if (!data.fatherName) return "اسم الأب مطلوب";
        if (!data.motherName) return "اسم الأم مطلوب";
        if (!data.nationality) return "الجنسية مطلوبة";
        if (!data.school) return "المدرسة مطلوبة";
        if (data.phoneNumber && !/^\d{7,15}$/.test(data.phoneNumber)) return "رقم الهاتف غير صحيح";
        if (data.fatherPhoneNumber && !/^\d{7,15}$/.test(data.fatherPhoneNumber)) return "رقم هاتف الأب غير صحيح";
        if (data.motherPhoneNumber && !/^\d{7,15}$/.test(data.motherPhoneNumber)) return "رقم هاتف الأم غير صحيح";
        if (!data.birthYear) return "سنة الميلاد غير صحيح";
        if (!data.emirate) return "الإمارة مطلوبة";
        if (!data.region) return "منطقة السكن مطلوبة";
        if (!data.halqaId) return "الرجاء اختيار الحلقة";
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

<div>
    <div style="height: 0px;"></div>
    <div class="form-grid">
        <!-- Row 1 -->
        <FormInputField label='الاسم والكنية' bind:value={data.fullName}/>
        <FormInputField label='اسم الأب' bind:value={data.fatherName}/>
        <FormInputField label='اسم الأم' bind:value={data.motherName}/>

        <!-- Row 2 -->
        <FormInputField label='الجنسية' bind:value={data.nationality}/>
        <FormInputField label='المدرسة' bind:value={data.school}/>
        <DropdownField label='سنة الميلاد' bind:value={data.birthYear} bind:options = {birthOptions}/>

        <!-- Row 3 -->
        <FormInputField label='رقم الهاتف' bind:value={data.phoneNumber}/>
        <FormInputField label='رقم الأب' bind:value={data.fatherPhoneNumber}/>
        <FormInputField label='رقم الأم' bind:value={data.motherPhoneNumber}/>

        <!-- Row 4 -->
        <FormInputField label='عمل الأب' bind:value={data.fatherWork}/>
        <FormInputField label='عمل الأم' bind:value={data.motherWork}/>
        <DropdownField label='الحلقة' bind:value={data.halqaId} bind:options={halqatOptions}/>

        <!-- Row 5 (only 2 fields, leave last column empty) -->
        <FormInputField label='الإمارة' bind:value={data.emirate}/>
        <FormInputField label='منطقة السكن' bind:value={data.region}/>
        <div></div>

        <div class="notes">
            <!-- Notes (span full row) -->
            <TextAreaField label='الملاحظات' bind:value={data.notes}/>
        </div>

        <p class="error-text">{errorText}</p>
        <div></div>
        <div class="submit-button">
            <Button onclick={handleSubmit}>{submitButtonText}</Button>
        </div> 
    </div>

    <div style="height: 30px;"></div>
</div>

<style>
    .form-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr); 
        column-gap: 50px; 
        row-gap: 25px;   
        align-items: start;
        width: 100%;
        margin: 0; 
    }

    .notes {
        grid-column: 1 / -1;
        height: 75px;
    }

    .error-text {
        grid-column: 1 / 2;
        align-self: center;
        color: red;
    }

    .submit-button {
        justify-self: end;
        width: auto;
    }
</style>