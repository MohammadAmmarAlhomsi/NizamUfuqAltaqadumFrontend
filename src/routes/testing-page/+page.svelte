<script>
    import Button from "$lib/components/Button.svelte";
  import StudentAttendanceCell from "$lib/components/forms/StudentAttendanceCell.svelte";
    import GroupActivityRecordItem from "$lib/components/GroupActivityRecordItem.svelte";

    import { fetchPairedInstructor } from "$lib/sdk/instructor";
    import { AttendanceDay } from "$lib/sdk/models/attendance-day.svelte";
    import { GroupActivity, StudentActivityWeight } from "$lib/sdk/models/group-activity.svlete";
  import { HalqaAttendanceRecord } from "$lib/sdk/models/halqa-attendance-record.svelte";
    import { IndividualActivity } from "$lib/sdk/models/indivisual-activity.svelte";
    import { Instructor } from "$lib/sdk/models/instructor.svelte";
    import { JuzuAccess } from "$lib/sdk/models/juzu-access.svelte";
    import { JuzuAssessment } from "$lib/sdk/models/juzu-assessment.svelte";
    import { PageRecitationRecord } from "$lib/sdk/models/page-recitation-record.svelte";
    import { QuranPage } from "$lib/sdk/models/quran-page.svelte";
    import { Student } from "$lib/sdk/models/student.svelte";
  import { StudentAttendanceRecord } from "$lib/sdk/models/student-attendance-record.svelte";
    import { json } from "@sveltejs/kit";
    import { onMount } from "svelte";

    /** * @type {Instructor} */
    let instructor = $state(null);
    let id = '883a1bc8-c6c1-4021-b1a5-4cf643fb7586'
    let groupId = 'cf89d714-dd0f-4282-9784-9b920e90843d'

    /**
     * @type {Array<PageRecitationRecord>}
     */
    let recitationRecords = [];

    onMount(async () => {
        // student.id = '459f7097-ddec-4471-b8ca-704a21695975'

        // await student.save();

        // let response = await student.delete();
        // instructor = await Instructor.getById(id);

        // let quranPages = await QuranPage.getAll();
        // console.log(JSON.stringify(quranPages, false, 2));

        // let activities = await IndividualActivity.getAll();
        // console.log(JSON.stringify(activities, false, 2));

        // let activity = await IndividualActivity.getById('8c15dc30-6166-4f17-b306-a11c8e05fb02');
        // console.log(activity);

        // let student = (await Student.getAll()).find(s => s.id == 'f16561b7-da5d-4236-b660-85c4a2eec76a');
        // console.log('student', JSON.stringify(student, false, 2));
        // recitationRecords = await PageRecitationRecord.getStudentAvailablePageRecitationRecords(student.id); 
        // console.log(JSON.stringify(recitationRecords, false, 2));

        // let studentAttendanceRecords = await StudentAttendanceRecord.getHalqaAttendanceStudentAttendanceRecords('7e26f86e-b3b8-4075-ac2f-ee6dc4b72e19');
        // console.log(JSON.stringify(studentAttendanceRecords, false, 2));
    });

    async function handleCreate() {

        let students = await Student.getAll();
        let halqaId = '5E48DCAE-7877-4557-9D9A-B51C8ADBD3B4';

        console.log('student', students[0]);

        let weights = [
            new StudentActivityWeight(students[0].id, 10),
            new StudentActivityWeight(students[1].id, 20),
            new StudentActivityWeight(students[2].id, 30),
            new StudentActivityWeight(students[3].id, 40),
        ]
        
        let groupActivity = new GroupActivity("نشاط المخيم", halqaId, new Date(), weights, "");
        groupActivity.id = groupId

        console.log(JSON.stringify(groupActivity, false, 2));

        await groupActivity.save();
    }

    async function handleUpdate() {
        let group = await GroupActivity.getById(groupId);
        group.weights[1].weight = 150;
        console.log(JSON.stringify(group, false, 2));
        await group.save();
    }

    async function handleDelete() {
        // let groupActivity = await GroupActivity.getById(groupId);
        // await groupActivity.delete();

        await recitationRecords[3].delete();
    }

    async function handleClickCreate() {
        // instructor = new Instructor(
        //     'أستاذ تجريبي',
        //     'dummy-instructor12345@gmail.com',
        //     'inst123456',
        //     'أستاذ تجريبي',
        //     '0566073802',
        //     'دبي',
        //     'التعاون',
        //     2003,
        //     'أستاذ تجريبي'
        // );
        // instructor.id = id;
        // await instructor.save();

        // alert('تم الحفظ!');

        // location.reload();
    }

    async function handleClickDelete() {
        await instructor.delete();
        alert('تم الحذف');

        location.reload();
    }
</script>

<div style="width: 100%; height: 100vh; display:flex; justify-content: center; align-items: center; flex-direction: column; gap: 10px">
    <Button onclick={handleClickCreate} width='150px'>إنشاء أستاذ</Button>
    <Button onclick={handleClickDelete} width='150px'>حذف الأستاذ</Button>
    <Button onclick={handleCreate}>إنشاء</Button>
    <Button onclick={handleUpdate}>تعديل</Button>
    <Button onclick={handleDelete}>حذف</Button>

    <p>{instructor?.password}</p>
</div>