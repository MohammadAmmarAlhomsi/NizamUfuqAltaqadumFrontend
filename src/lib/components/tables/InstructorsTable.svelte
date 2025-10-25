<script>
    import { onMount } from "svelte";
    import GenericTable from "../GenericTable.svelte";
    import { retrieveInstructors, verifyCreateInstructorPermission } from "$lib/sdk/instructor";
    import { json } from "@sveltejs/kit";


    let instructors = $state([]);

    let columns = [
        { label: "اسم المستخدم", prop: "username" },
        { label: "الاسم الكامل", prop: "fullName" },
        { label: "البريد الإلكتروني", prop: "email" },
        { label: "رقم الهاتف", prop: "phoneNumber" },
        { label: "الإمارة", prop: "emirate" },
        { label: "منطقة السكن", prop: "region" },
        { label: "سنة الميلاد", prop: "birthYear" }
    ];

    const actions = [
        { label: "تعديل", callback: (item) => console.log("edit", item), color: "#2196F3" },
        { label: "حذف", callback: (item) => console.log("delete", item.id), color: "#f44336" }
    ];

    function handleEdit(data) {
        window.location.href = `/instructor/${data.id}/update`
        // alert(JSON.stringify(data, '', 3))
    }

    function handleDelete(data) {
        alert(JSON.stringify(data, '', 3))
    }

    async function load() {
        try {
            instructors = await retrieveInstructors();
            instructors = instructors.map(inst => ({
                ...inst,
            }));
            console.log(JSON.stringify(instructors, null, 2));
        } catch (error) {
            console.error("Error loading instructors:", error);
        }
    }

    export async function requestCreateNew() {
        try {
            await verifyCreateInstructorPermission();
            window.location.href = `/instructor/create`;
        } catch (error) {
            alert("ليس لديك إذن لإنشاء أستاذ جديد.");
            console.error("Permission error:", error);
        }
    }

    onMount(async () => {
        await load();
    });
</script>

<GenericTable 
    {columns} 
    items={instructors} 
    onEdit={handleEdit} 
    onDelete={handleDelete}
    />

<style>

</style>