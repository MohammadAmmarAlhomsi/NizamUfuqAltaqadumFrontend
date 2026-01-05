<script>
    import FormInputField from "../FormInputField.svelte";
    import TextAreaField from "../TextAreaField.svelte";
    import Button from "../Button.svelte";
    import DateField from "../DateField.svelte";
    import DropdownField from "../DropdownField.svelte";
    import { onMount } from "svelte";

    const { submitButtonText='إرسال', onsubmit = (data) => { }, data = $bindable({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        birthYear: 2000,  
        emirate: '',
        region: '',
        notes: ''
    }), ...props } = $props(); 

    let errorText = $state('');
    let birthOptions = $state([]);

    onMount(() => {
        let yearsCount = 30;
        let currentYear = new Date().getFullYear();
        birthOptions = Array.from({length: yearsCount}, (_, i) => {
            return { 
                text: currentYear - i, 
                value: currentYear - i 
            }
        })
    });

     function validate() {
        if (!data.username || data.username.length < 3) {
            return "اسم المستخدم يجب أن يكون 3 أحرف على الأقل";
        }
        if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) {
            return "الرجاء إدخال بريد إلكتروني صحيح";
        }
        if (!data.password || data.password.length < 4) {
            return "كلمة المرور يجب أن تكون 4 أحرف على الأقل";
        }
        if (!data.fullName) {
            return "الاسم الكامل مطلوب";
        }
        if (data.phoneNumber && !/^\d{7,15}$/.test(data.phoneNumber)) {
            return "رقم الهاتف غير صحيح";
        }
        if (!data.birthYear) {
            return "سنة الميلاد غير صحيح";
        }
        if (!data.emirate) {
            return "الرجاء اختيار الإمارة";
        }
        return "";
    }

    function handleSubmit() {
        const error = validate();

        if (error) {
            errorText = error;
            return;
        }

        console.log(error);

        errorText = '';
        onsubmit(data);
    }
</script>

<div class="container">
    <div class="row">
        <FormInputField label='اسم المستخدم' bind:value={data.username}/>
        <div style="width: 50px;"></div>
        <FormInputField label='البريد الإلكتروني' bind:value={data.email}/>
    </div>
    <div style="height: 25px;"></div>
    <div class="row">
        <FormInputField label='كلمة المرور' bind:value={data.password}/>
        <div style="width: 50px;"></div>
        <FormInputField label='الاسم الكامل' bind:value={data.fullName}/>
    </div>
    <div style="height: 25px;"></div>
    <div class="row">
        <FormInputField label='رقم الهاتف' bind:value={data.phoneNumber}/>
        <div style="width: 50px;"></div>
        <FormInputField label='الإمارة' bind:value={data.emirate}/>
    </div>
    <div style="height: 25px;"></div>
    <div class="row">
        <FormInputField label='منطقة السكن' bind:value={data.region}/>
        <div style="width: 50px;"></div>
        <DropdownField label='سنة الميلاد' bind:value={data.birthYear} bind:options={birthOptions}/>
    </div>
    <div style="height: 25px;"></div>
    <div class="row notes">
        <TextAreaField label='الملاحظات' bind:value={data.notes}/>
    </div>
    <div style="height: 25px;"></div>
    <div class='row'>
        <p class="error-text">{errorText}</p>
        <div style="flex: 1;"></div>
        <Button onclick={handleSubmit}>{submitButtonText}</Button>
    </div>
</div>

<style>
    .container {
        width: min(1100px, 100%);
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .row {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 16px;
    }

    .notes {
        height: 75px;
    }

    .error-text {
        height: 30px;
        margin: 10px 0px;
        color: red;
    }

    @media (max-width: 768px) {
        .row {
            flex-direction: column;
            gap: 12px;
        }

        .notes {
            height: auto;
        }
    }
</style>
