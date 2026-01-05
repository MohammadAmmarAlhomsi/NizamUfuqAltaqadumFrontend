<script>
  let { text = 'جارٍ التحميل...' } = $props();
</script>

<div class="loader-backdrop" aria-live="polite" role="status">
  <div class="loader-box">
    <div class="spinner" aria-hidden="true"></div>
    <p>{text}</p>
  </div>
</div>

<style>
  .loader-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(2px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 30;
  }

  .loader-box {
    min-width: 160px;
    padding: 16px 20px;
    border-radius: 14px;
    background: #fff;
    box-shadow: 0 18px 45px -22px rgba(0, 0, 0, 0.35);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 4px solid rgba(99, 102, 241, 0.2);
    border-top-color: #4f46e5;
    border-radius: 9999px;
    animation: spin 0.9s linear infinite;
  }

  p {
    margin: 0;
    font-weight: 600;
    color: #0f172a;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
</style>
