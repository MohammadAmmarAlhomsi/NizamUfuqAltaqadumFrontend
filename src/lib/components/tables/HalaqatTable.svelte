<script>
    import { onMount } from "svelte";
    import { retrieveInstructors, verifyCreateInstructorPermission } from "$lib/sdk/instructor";
    import { json } from "@sveltejs/kit";
    import { retrieveAllHalqat } from "$lib/sdk/halqa";
    
    import GenericTable from "../GenericTable.svelte";
    
    let halqat = $state([]);
    let halqatTableElements = $state([]);

    let columns = [ 
        { label: "اسم الحلقة", prop: "name" },
        { label: "اسم الأستاذ", prop: "instructorName" },
        { label: "اليوم", prop: "halqaDayName" },
        { label: "عدد الطلاب", prop: "studentsCount" },
    ];

    const actions = [
        { label: "تعديل", callback: (item) => console.log("edit", item), color: "#2196F3" },
        { label: "حذف", callback: (item) => console.log("delete", item.id), color: "#f44336" }
    ];

    function handleEdit(data) {
        window.location.href = `/halqa/${data.id}/update`
        // alert(JSON.stringify(data, '', 3))
    }

    function handleDelete(data) {
        alert(JSON.stringify(data, '', 3))
    }

    function handleClickHalqa(halqa) {
        window.location.href = `/halqa/${halqa.id}`
    }

    function translateDay(dayName) {
        if (dayName == 'Saturday') {
            return 'السبت'
        } else if (dayName == 'Sunday') {
            return 'الأحد'
        }

        return dayName;
    }

    async function load() {
        try {
            halqat = await retrieveAllHalqat();
            halqatTableElements = halqat.map(halqa => {
                return {
                    "id": halqa.id,
                    "name": halqa.name,
                    "halqaDay": halqa.halqaDay,
                    "halqaDayName": translateDay(halqa.halqaDay),
                    "instructorName": halqa.instructorName,
                    "studentsCount": halqa.students.length
                }
            })

            console.log(JSON.stringify(halqat, null, 2));
        } catch (error) {
            console.error("Error loading halqat:", error);
        }
    }

    export async function requestCreateNew() {
        try {
            await verifyCreateInstructorPermission();
            window.location.href = `/halqa/create`;
        } catch (error) {
            alert("ليس لديك الإذن لإنشاء حلقة جديدة.");
            console.error("Permission error:", error);
        }
    }

    onMount(async () => {
        await load();
    });
</script>

<GenericTable 
    {columns} 
    items={halqatTableElements} 
    onEdit={handleEdit} 
    onDelete={handleDelete}
    onclickItem={handleClickHalqa}/>

<style>

</style>