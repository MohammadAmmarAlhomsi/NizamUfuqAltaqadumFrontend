<script>
    import Header from '$lib/components/layout/Header.svelte';
    import InstructorDataForm from '$lib/components/forms/InstructorDataForm.svelte';
    import DateField from '$lib/components/DateField.svelte';
    import TabContainer from '$lib/components/TabsContainer.svelte';
    import InstructorsTable from '$lib/components/tables/InstructorsTable.svelte';
    import StudentsTable from '$lib/components/tables/StudentsTable.svelte';
    import HalaqatTable from '$lib/components/tables/HalaqatTable.svelte';
    import Button from '$lib/components/Button.svelte';
    import ExaminerTable from '$lib/components/tables/ExaminerTable.svelte';
    
    import { getUserData as getUserDataAsync } from '$lib/sdk/auth';
    import { onMount } from 'svelte';
    import { verifyCreateInstructorPermission } from '$lib/sdk/instructor';
    import { retrieveAllStudents } from '$lib/sdk/student';
    
    let selectedTabIdx = $state(0);
    
    const tabs = $state([ 
        { label: 'الطلاب' }, 
        { label: 'الأساتذة' },
        { label: 'الحلقات' },
        { label: 'المختبرين' }
    ])

    onMount(async () => {
        let userData = await getUserDataAsync();
        console.log(userData);
        if (userData == null) {
            window.location.href = `/signin`
        }
    })

    async function handleCreateNew() {
        await tableComponentRef?.requestCreateNew();
    }

    let tableComponentRef = $state(null);
</script>

<main>
    <Header>
        <div style="flex: 1;"></div>
        <div class="menues-header-container">
            <div style="width: 350px;"></div>
            <TabContainer bind:selectedIdx={selectedTabIdx} tabs={tabs}/>
            <div style="width: 50px;"></div>
            <div style="width: 300px;">
                <Button onclick={handleCreateNew}>➕ إضافة جديد</Button>
            </div>
        </div>
    </Header>

    {#snippet renderTableElement()}
        {#if selectedTabIdx == 0}
            <StudentsTable loadStudents={retrieveAllStudents} bind:this={tableComponentRef}/>
        {:else if selectedTabIdx == 1}
            <InstructorsTable bind:this={tableComponentRef}/>
        {:else if selectedTabIdx == 2}
            <HalaqatTable bind:this={tableComponentRef}/>
        {:else if selectedTabIdx == 3}
            <ExaminerTable bind:this={tableComponentRef}/>
        {/if}
    {/snippet}

    <div class="container">
        {@render renderTableElement()}
        <div style="height: 50px;"></div>
    </div>
</main>

<style>
    .container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        
        padding-top: 130px;
    }

    .menues-header-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        position: absolute;
        left: 50%;
        transform: translate(-50%, 0);
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
    }
</style>