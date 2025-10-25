<script>
    import FormInputField from "../FormInputField.svelte";
    import TextAreaField from "../TextAreaField.svelte";
    import Button from "../Button.svelte";
    import DropdownField from "../DropdownField.svelte";

    import { onMount } from "svelte";

    let { 
        submitButtonText = 'إرسال', 
        onsubmit = (data) => {}, 
        data = $bindable({
            username: '',
            email: '',
            password: '',
            fullName: '',
            phoneNumber: '',
            notes: ''
        }), 
        ...props 
    } = $props();

    let errorText = $state('');
    let users = $state([]);
    let userOptions = $state([]);

    onMount(async () => {

    });

    function validate() {
        if (!data.username || data.username.length < 3)
            return "اسم المستخدم يجب أن يكون 3 أحرف على الأقل";
        if (!data.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email))
            return "البريد الإلكتروني غير صالح";
        if (!data.password || data.password.length < 6)
            return "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
        if (!data.fullName)
            return "الاسم الكامل مطلوب";
        if (!data.phoneNumber || !/^\d{7,15}$/.test(data.phoneNumber))
            return "رقم الهاتف غير صحيح";
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

<div class="form-grid">
    <!-- Row 1 -->
    <FormInputField label='اسم المستخدم' bind:value={data.username}/>
    <FormInputField label='البريد الإلكتروني' bind:value={data.email}/>
    <FormInputField label='كلمة المرور' bind:value={data.password}/>

    <!-- Row 2 -->
    <FormInputField label='الاسم الكامل' bind:value={data.fullName}/>
    <FormInputField label='رقم الهاتف' bind:value={data.phoneNumber}/>

    <!-- Row 3 -->
    <div class="notes">
        <TextAreaField label='ملاحظات' bind:value={data.notes}/>
    </div>

    <p class="error-text">{errorText}</p>
    <div></div>
    <div class="submit-button">
        <Button onclick={handleSubmit}>{submitButtonText}</Button>
    </div>
</div>


<style>
    .form-grid {
        display: grid;
        grid-template-columns: repeat(auto, minmax(200px, 1fr));
        column-gap: 50px;
        row-gap: 25px;
        align-items: start;
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
