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
    let mainEl;
    
    onMount(async () => {
        await source.onMount();
        const headerEl = document.querySelector('.app-header');
        if (!headerEl || !mainEl) return;

        const updateHeaderHeight = () => {
            const height = headerEl.getBoundingClientRect().height;
            mainEl.style.setProperty('--header-height', `${height}px`);
        };

        updateHeaderHeight();
        const observer = new ResizeObserver(updateHeaderHeight);
        observer.observe(headerEl);
        window.addEventListener('resize', updateHeaderHeight);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', updateHeaderHeight);
        };
    })
</script>

<main bind:this={mainEl} class="director-page">
    <Header>
        <div class="dashboard-header">
            <div class="dashboard-title">
                <span class="eyebrow">لوحة التحكم</span>
                <h1>لوحة المدير</h1>
            </div>
            <div class="dashboard-tabs">
                <div class="tabs-shell">
                    <TabContainer bind:selectedIdx={source.selectedTabIdx} tabs={source.tabs}/>
                </div>
            </div>
            <div class="dashboard-action">
                <Button onclick={() => window.location.href = '/whatsapp'}>واتساب</Button>
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
        padding: calc(var(--header-height, 0px) + var(--header-gap, 24px)) 16px 24px;
        box-sizing: border-box;
    }

    .dashboard-header {
        display: flex;
        align-items: center;
        gap: 24px;
        padding: 12px 24px;
        width: 100%;
        box-sizing: border-box;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .dashboard-title {
        display: flex;
        flex-direction: column;
        gap: 4px;
        min-width: 200px;
        max-width: 100%;
    }

    .dashboard-title h1 {
        margin: 0;
        font-size: 1.7rem;
        font-weight: 700;
    }

    .eyebrow {
        font-size: 0.85rem;
        color: #666;
        letter-spacing: 0.02em;
    }

    .dashboard-tabs {
        flex: 1 1 420px;
        display: flex;
        justify-content: center;
        min-width: 240px;
    }

    .tabs-shell {
        display: inline-flex;
        align-items: center;
        padding: 6px 12px;
        border: 1px solid #111;
        border-radius: 999px;
        background: #fff;
        max-width: 100%;
        width: fit-content;
    }

    .dashboard-action {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        min-width: 180px;
    }

    @media (max-width: 900px) {
        .director-page {
            --header-gap: 40px;
        }

        .dashboard-header {
            justify-content: center;
            padding: 12px 16px;
        }

        .dashboard-title {
            align-items: center;
            text-align: center;
        }

        .dashboard-tabs {
            order: 3;
            width: 100%;
        }

        .dashboard-action {
            order: 2;
            width: 100%;
            justify-content: center;
        }

    }

    .director-page {
        --header-gap: 24px;
    }

    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100vh;
    }
</style>
