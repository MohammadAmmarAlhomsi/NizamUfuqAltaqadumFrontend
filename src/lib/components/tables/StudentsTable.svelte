<script>
    import GenericTable from "../GenericTable.svelte";

    import { onMount } from "svelte";
    import { retrieveAllStudents, verifyCreateStudentPermission } from "$lib/sdk/student";

    let { loadStudents = null, ...props } = $props()

    let students = $state([]);

    let columns = [
        { label: "الاسم الكامل", prop: "fullName" },
        { label: "اسم الأب", prop: "fatherName" },
        { label: "اسم الأم", prop: "motherName" },
        { label: "سنة الميلاد", prop: "birthYear" },
        { label: "الجنسية", prop: "nationality" },
        { label: "المدرسة", prop: "school" },
        { label: "رقم الهاتف", prop: "phoneNumber" },
        { label: "رقم الأب", prop: "fatherPhoneNumber" },
        { label: "رقم الأم", prop: "motherPhoneNumber" },
        { label: "عمل الأب", prop: "fatherWork" },
        { label: "عمل الأم", prop: "motherWork" },
        { label: "الإمارة", prop: "emirate" },
        { label: "المنطقة", prop: "region" },
        { label: "الحلقة", prop: "halqaName" },
    ];

    function handleEdit(data) {
        window.location.href = `/student/${data.id}/update`
    }

    function handleDelete(data) {
        alert("Delete student:\n" + JSON.stringify(data, null, 3));
    }

    export async function requestCreateNew() {
        window.location.href = '/student/create'
    }

    onMount(async () => {
        loadStudents = loadStudents ?? retrieveAllStudents;

        try {
            students = await loadStudents();
            students = students.map(s => ({
                ...s,// Format date as YYYY-MM-DD
            }));
            console.log($state.snapshot(students));
        } catch (e) {
            console.log('unable to load students');
            console.error(e);
        }
        console.log("Students table mounted");
    });
</script>

<GenericTable {columns} bind:items={students} onEdit={handleEdit} onDelete={handleDelete}/>
