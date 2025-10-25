<script>
    import { onMount } from "svelte";
    import GenericTable from "../GenericTable.svelte";
    import { 
        retrieveAllExaminers, 
        deleteExaminer 
    } from "$lib/sdk/examiner";
    import { verifyCreateInstructorPermission } from "$lib/sdk/instructor"; // placeholder if you later add verifyCreateExaminerPermission

    let examiners = $state([]);
    let examinersTableElements = $state([]);

    // Define table columns
    let columns = [
        { label: "الاسم الكامل", prop: "fullName" },
        { label: "اسم المستخدم", prop: "username" },
        { label: "البريد الإلكتروني", prop: "email" },
        { label: "رقم الهاتف", prop: "phoneNumber" },
        { label: "ملاحظات", prop: "notes" },
    ];

    // Edit & delete buttons
    const actions = [
        { label: "تعديل", callback: handleEdit, color: "#2196F3" },
        { label: "حذف", callback: handleDelete, color: "#f44336" },
    ];

    // Navigate to update page
    function handleEdit(data) {
        window.location.href = `/examiner/${data.id}/update`;
    }

    // Delete examiner
    async function handleDelete(data) {
        if (!confirm("هل أنت متأكد من حذف هذا الممتحن؟")) return;

        const success = await deleteExaminer(data.id);
        if (success) {
            examinersTableElements = examinersTableElements.filter(e => e.id !== data.id);
        } else {
            alert("فشل في حذف الممتحن.");
        }
    }

    // When clicking on row
    function handleClickExaminer(examiner) {
        window.location.href = `/examiner/${examiner.id}/update`;
    }

    // Load all examiners from backend
    async function load() {
        try {
            const data = await retrieveAllExaminers();

            // Important: make sure your backend returns examiner.Id in the model
            // If not, you can temporarily assign an index as ID
            examinersTableElements = data.map((examiner, i) => ({
                id: examiner.id || i,
                username: examiner.username,
                email: examiner.email,
                fullName: examiner.fullName,
                phoneNumber: examiner.phoneNumber,
                notes: examiner.notes
            }));

            examiners = data;
            console.log("Loaded examiners:", data);
        } catch (error) {
            console.error("Error loading examiners:", error);
        }
    }

    // Request permission & navigate to create page
    export async function requestCreateNew() {
        try {
            await verifyCreateInstructorPermission(); // temporary placeholder
            window.location.href = `/examiner/create`;
        } catch (error) {
            alert("ليس لديك الإذن لإنشاء ممتحن جديد.");
            console.error("Permission error:", error);
        }
    }

    onMount(async () => {
        await load();
    });
</script>

<GenericTable 
    {columns} 
    items={examinersTableElements} 
    onEdit={handleEdit} 
    onDelete={handleDelete}
    onclickItem={handleClickExaminer}
/>

<style>

</style>
