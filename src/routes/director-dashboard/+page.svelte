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
    import TableRenderer from '$lib/components/base-table/table-renderer.svelte';
    import TableSectionRenderer from '$lib/sections/table-section-renderer.svelte';
    
    import { onMount } from 'svelte';
    import { verifyCreateInstructorPermission } from '$lib/sdk/instructor';
    import { retrieveAllStudents } from '$lib/sdk/student';
    import { BaseTable } from '$lib/components/base-table/base-table.svelte';
    import { DirectorPage } from './director-page.svelte';  

    let source = $state(new DirectorPage());
    
    onMount(async () => {
        await source.onMount();
    })
</script>

<main>
    <Header>
        <div style="flex: 1;"></div>         
        <div class="menues-header-container">
            <div style="width: 350px;"></div>
            <TabContainer bind:selectedIdx={source.selectedTabIdx} tabs={source.tabs}/>
            <div style="width: 50px;"></div> 
            <div style="width: 300px;">      
                <Button onclick={source.handleCreateNew}>➕ إضافة جديد</Button>
            </div>                           
        </div>                                
    </Header>

    <div class="container">
        <TableSectionRenderer source={source.currentSection}/>
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