<script>
    import { onMount } from "svelte";
    import Button from "./Button.svelte";

    const { 
        items = $bindable([]), 
        columns = [], 
        onEdit = (inst) => {}, 
        onDelete = (id) => {},
        onclickItem = item => {} 
    } = $props();

    $effect(() => {
        console.log('hi there!!')
        console.log($state.snapshot(items));
    })
</script>

<div class="table-container">
    <table>
        <thead>
            <tr>
                <th></th>
                {#each columns as col}
                    <th>{col.label}</th>
                {/each}
                <th>أمر</th>
            </tr>
        </thead>
        <tbody>
            {#if items.length > 0}
                {#each items as item, i (item.id)}
                    <tr onclick={() => onclickItem(item)}>
                        <td>{i+1}.</td>
                        {#each columns as col}
                            <td>{item[col.prop]}</td>
                        {/each}
                        <td>
                            <div class="actions">
                                <Button onclick={() => onEdit(item)}>تعديل</Button>
                            </div>
                            <!-- <Button onclick={() => onDelete(inst)} style="background:#f66">حذف</Button> -->
                        </td>
                    </tr>
                {/each}
            {:else}
                <tr style="width: 100%">
                    <td colspan="16" class="no-data">لا يوجد</td>
                </tr>
            {/if}
        </tbody>
    </table>
</div>

<style>
    .table-container {
        width: 100%;
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0px 3px 6px rgba(0,0,0,0.1);
        overflow: hidden;
    }

    thead {
        background: #f5f5f5;
    }

    th, td {
        padding: 12px 16px;
        text-align: start;
        border-bottom: 1px solid #e0e0e0;
    }

    th {
        font-weight: bold;
        color: #333;
    }

    tr:hover {
        background: #fafafa;
        cursor: pointer;
    }

    .actions {
        display: flex;
        gap: 8px;
        align-items: center; /* vertically center buttons */
        justify-content: center;
    }

    .no-data {
        text-align: center;
        padding: 20px;
        color: #888;
    }
</style>
