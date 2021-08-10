<script>
  import { ToastNotification } from "carbon-components-svelte";
  import { notification } from "./store.js";
  import { onDestroy } from "svelte";

  export let timeout = 3000;

  let count = 0;
  let toasts = [];
  let unsubscribe;

  function animateOut(node, { delay = 0, duration = 1000 }) {
    return {
      delay,
      duration,
      css: (t) => `opacity: ${(t - 0.7) * 1}; transform-origin: top right;`,
    };
  }

  function createToast(kind, title, subtitle, caption, to) {
    const newToast = {
      id: count,
      kind,
      title,
      subtitle,
      caption,
      timeout: to || timeout,
      width: "100%",
    };
    toasts = [newToast, ...toasts];
    count = count + 1;
  }

  unsubscribe = notification.subscribe((value) => {
    if (!value) {
      return;
    }
    createToast(
      value.kind,
      value.title,
      value.subtitle,
      value.caption,
      value.to
    );
    notification.set();
  });

  onDestroy(unsubscribe);

  function removeToast(id) {
    toasts = toasts.filter((t) => t.id != id);
  }
</script>

<style>
  :global(.toasts) {
    list-style: none;
    position: fixed;
    top: 80px;
    right: 0;
    padding: 0;
    margin: 0;
    z-index: 9999;
  }

  :global(.toasts) > .toast {
    position: relative;
    margin: 1vh 1vw;
    position: relative;
    animation: animate-in 600ms forwards;
  }

  @keyframes animate-in {
    0%,
    60%,
    75%,
    90%,
    to {
      -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    0% {
      opacity: 0;
      transform: translate3d(3000px, 0, 0);
    }

    60% {
      opacity: 1;
      transform: translate3d(-25px, 0, 0);
    }

    75% {
      transform: translate3d(10px, 0, 0);
    }

    90% {
      transform: translate3d(-5px, 0, 0);
    }

    to {
      transform: none;
    }
  }

  @keyframes shrink {
    0% {
      width: 98vw;
    }
    100% {
      width: 0;
    }
  }

  @media (min-width: 480px) {
    @keyframes animate-in {
      0%,
      60%,
      75%,
      90%,
      to {
        -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      }

      0% {
        opacity: 0;
        transform: translate3d(3000px, 0, 0);
      }

      60% {
        opacity: 1;
        transform: translate3d(-25px, 0, 0);
      }

      75% {
        transform: translate3d(10px, 0, 0);
      }

      90% {
        transform: translate3d(-5px, 0, 0);
      }

      to {
        transform: none;
      }
    }

    @keyframes shrink {
      0% {
        width: 40vw;
      }
      100% {
        width: 0;
      }
    }
  }
</style>

<ul class="toasts">
  {#each toasts as toast (toast.id)}
    <li class="toast" out:animateOut>
      <ToastNotification
        kind="{toast.kind}"
        title="{toast.title}"
        subtitle="{toast.subtitle}"
        caption="{new Date().toLocaleString()}"
        style="animation-duration: {toast.timeout}ms;"
        on:click="{() => removeToast(toast.id)}"
        on:animationend="{() => removeToast(toast.id)}"
      />
    </li>
  {/each}
</ul>
