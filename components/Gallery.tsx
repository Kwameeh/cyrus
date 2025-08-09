"use client";

import { useEffect, useRef, useState } from "react";
import { useTransitionRouter } from "next-view-transitions";
import gsap from "gsap";
import { CustomEase } from "gsap/dist/CustomEase";
import SplitType from "split-type";
import { projects } from "@/libs/data";

export default function Gallery() {
  const router = useTransitionRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const projectTitleRef = useRef<HTMLDivElement>(null);
  const expandedItemRef = useRef<HTMLDivElement>(null);

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = () => {
      initializeGallery();
      setInitialized(true);
    };

    gsap.registerPlugin(CustomEase);
    CustomEase.create("hop", "0.9, 0, 0.1, 1");

    initializeApp();

    return () => {
      // Copy refs to variables to avoid ESLint warnings about changing ref values
      const container = containerRef.current;
      const state = stateRef.current;

      if (container) {
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("touchstart", handleTouchStart);
      }

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);

      if (state.animationFrameId) {
        cancelAnimationFrame(state.animationFrameId);
      }
    };
  }, []);

  const itemCount = projects.length;
  const itemGap = 150;
  const columns = 4;
  const itemWidth = 120;
  const itemHeight = 160;

  const stateRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    dragVelocityX: 0,
    dragVelocityY: 0,
    lastDragTime: 0,
    mouseHasMoved: false,
    visibleItems: new Set<string>(),
    lastUpdateTime: 0,
    lastX: 0,
    lastY: 0,
    isExpanded: false,
    activeItem: null as HTMLElement | null,
    canDrag: true,
    originalPosition: null as {
      id: string;
      rect: DOMRect;
      imgSrc: string;
    } | null,
    expandedItem: null as HTMLElement | null,
    activeItemId: null as string | null,
    titleSplit: null as any,
    animationFrameId: null as number | null,
    viewButton: null as HTMLButtonElement | null,
  });

  const setAndAnimateTitle = (title: string) => {
    const { titleSplit } = stateRef.current;
    const projectTitleElement = projectTitleRef.current?.querySelector("p");

    if (!projectTitleElement) return;

    if (titleSplit) titleSplit.revert();
    projectTitleElement.textContent = title;

    stateRef.current.titleSplit = new SplitType(projectTitleElement, {
      types: "words",
    });
    gsap.set(stateRef.current.titleSplit.words, { y: "100%" });
  };

  const slideInOut = () => {
    document.documentElement.animate(
      [
        {
          opacity: 1,
          transform: "translateY(0)",
        },
        {
          opacity: 0.2,
          transform: "translateY(-35%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-old(root)",
      }
    );

    document.documentElement.animate(
      [
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        },
      ],
      {
        duration: 1500,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        fill: "forwards",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  const animateTitleIn = () => {
    if (stateRef.current.titleSplit) {
      gsap.to(stateRef.current.titleSplit.words, {
        y: "0%",
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });
    }
  };

  const animateTitleOut = () => {
    if (stateRef.current.titleSplit) {
      gsap.to(stateRef.current.titleSplit.words, {
        y: "-100%",
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      });
    }
  };

  const updateVisibleItems = () => {
    const state = stateRef.current;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const buffer = 2.5;
    const viewWidth = window.innerWidth * (1 + buffer);
    const viewHeight = window.innerHeight * (1 + buffer);
    const movingRight = state.targetX > state.currentX;
    const movingDown = state.targetY > state.currentY;
    const directionBufferX = movingRight ? -300 : 300;
    const directionBufferY = movingDown ? -300 : 300;

    const startCol = Math.floor(
      (-state.currentX - viewWidth / 2 + (movingRight ? directionBufferX : 0)) /
        (itemWidth + itemGap)
    );
    const endCol = Math.ceil(
      (-state.currentX +
        viewWidth * 1.5 +
        (!movingRight ? directionBufferX : 0)) /
        (itemWidth + itemGap)
    );
    const startRow = Math.floor(
      (-state.currentY - viewHeight / 2 + (movingDown ? directionBufferY : 0)) /
        (itemHeight + itemGap)
    );
    const endRow = Math.ceil(
      (-state.currentY +
        viewHeight * 1.5 +
        (!movingDown ? directionBufferY : 0)) /
        (itemHeight + itemGap)
    );

    const currentItems = new Set();

    for (let row = startRow; row <= endRow; row++) {
      for (let col = startCol; col <= endCol; col++) {
        const itemId = `${col},${row}`;
        currentItems.add(itemId);

        if (state.visibleItems.has(itemId)) continue;
        if (state.activeItemId === itemId && state.isExpanded) continue;

        const item = document.createElement("div");
        item.className = "item";
        item.id = itemId;
        item.style.left = `${col * (itemWidth + itemGap)}px`;
        item.style.top = `${row * (itemHeight + itemGap)}px`;
        item.dataset.col = col.toString();
        item.dataset.row = row.toString();

        const itemIndex = Math.abs(row * columns + col) % projects.length;
        const img = document.createElement("img");
        item.dataset.index = itemIndex.toString();
        img.src = projects[itemIndex].image;
        img.alt = projects[itemIndex].title;
        item.appendChild(img);

        item.addEventListener("click", (e) => {
          if (state.mouseHasMoved || state.isDragging) return;
          handleItemClick(item);
        });

        canvas.appendChild(item);
        state.visibleItems.add(itemId);
      }
    }

    state.visibleItems.forEach((itemId) => {
      if (
        !currentItems.has(itemId) ||
        (state.activeItemId === itemId && state.isExpanded)
      ) {
        const item = document.getElementById(itemId);
        if (item && canvas && canvas.contains(item)) canvas.removeChild(item);
        state.visibleItems.delete(itemId);
      }
    });
  };

  const handleItemClick = (item: HTMLElement) => {
    const state = stateRef.current;

    if (state.isExpanded) {
      if (state.expandedItem) closeExpandedItem();
    } else {
      expandItem(item);
    }
  };

  const expandItem = (item: HTMLElement) => {
    const state = stateRef.current;
    const container = containerRef.current;
    const overlay = overlayRef.current;

    state.isExpanded = true;
    state.activeItem = item;
    state.activeItemId = item.id;
    state.canDrag = false;
    if (container) container.style.cursor = "auto";

    const imgElement = item.querySelector("img");
    if (!imgElement) return;

    const indexAttr = item.dataset.index;
    const titleIndex = Number.isFinite(parseInt(indexAttr || "", 10))
      ? parseInt(indexAttr as string, 10)
      : 0;

    setAndAnimateTitle(projects[titleIndex]?.title ?? "");
    item.style.visibility = "hidden";

    const rect = item.getBoundingClientRect();
    const targetImg = imgElement.src;

    state.originalPosition = {
      id: item.id,
      rect: rect,
      imgSrc: targetImg,
    };

    if (overlay) overlay.classList.add("active");

    const expandedItem = document.createElement("div");
    expandedItem.className = "expanded-item";
    expandedItem.style.width = `${itemWidth}px`;
    expandedItem.style.height = `${itemHeight}px`;

    const img = document.createElement("img");
    img.src = targetImg;
    expandedItem.appendChild(img);

    // Add View Project button
    const projectPath = `/project/${titleIndex}`;
    const viewButton = document.createElement("button");
    viewButton.className = "view-project-btn";
    viewButton.type = "button";
    viewButton.textContent = "View Project";
    viewButton.addEventListener("click", (e) => {
      e.stopPropagation();
      closeExpandedItem();
      router.push(projectPath, { onTransitionReady: slideInOut });
    });
    expandedItem.appendChild(viewButton);
    stateRef.current.viewButton = viewButton;

    expandedItem.addEventListener("click", closeExpandedItem);
    document.body.appendChild(expandedItem);

    state.expandedItem = expandedItem;

    document.querySelectorAll(".item").forEach((el) => {
      if (el !== state.activeItem) {
        gsap.to(el, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    const viewportWidth = window.innerWidth;
    const targetWidth = viewportWidth * 0.4;
    const targetHeight = targetWidth * 1.2;

    gsap.delayedCall(0.5, animateTitleIn);

    gsap.fromTo(
      expandedItem,
      {
        width: itemWidth,
        height: itemHeight,
        x: rect.left + itemWidth / 2 - window.innerWidth / 2,
        y: rect.top + itemHeight / 2 - window.innerHeight / 2,
      },
      {
        width: targetWidth,
        height: targetHeight,
        x: 0,
        y: 0,
        duration: 1,
        ease: "hop",
        onComplete: () => {
          if (stateRef.current.viewButton) {
            gsap.fromTo(
              stateRef.current.viewButton,
              { autoAlpha: 0, y: 10 },
              { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }
            );
          }
        },
      }
    );
  };

  const closeExpandedItem = () => {
    const state = stateRef.current;
    const container = containerRef.current;
    const overlay = overlayRef.current;

    if (!state.expandedItem || !state.originalPosition) return;

    animateTitleOut();
    if (overlay) overlay.classList.remove("active");
    const originalRect = state.originalPosition?.rect;
    if (!originalRect) return;

    document.querySelectorAll(".item").forEach((el) => {
      if (el.id !== state.activeItemId) {
        gsap.to(el, {
          opacity: 1,
          duration: 0.5,
          delay: 0.5,
          ease: "power2.out",
        });
      }
    });

    const originalItem = state.activeItemId
      ? document.getElementById(state.activeItemId)
      : null;

    // Timeline to animate button out first, then shrink the card cleanly
    const tl = gsap.timeline();
    if (state.viewButton) {
      tl.to(state.viewButton, {
        autoAlpha: 0,
        y: 10,
        duration: 0.2,
        ease: "power2.inOut",
      });
    }

    tl.to(state.expandedItem, {
      width: itemWidth,
      height: itemHeight,
      x: originalRect.left + itemWidth / 2 - window.innerWidth / 2,
      y: originalRect.top + itemHeight / 2 - window.innerHeight / 2,
      duration: 1,
      ease: "hop",
      onComplete: () => {
        if (state.expandedItem && state.expandedItem.parentNode) {
          document.body.removeChild(state.expandedItem);
        }

        if (originalItem) {
          originalItem.style.visibility = "visible";
        }

        state.expandedItem = null;
        state.viewButton = null;
        state.isExpanded = false;
        state.activeItem = null;
        state.originalPosition = null;
        state.activeItemId = null;
        state.canDrag = true;
        if (container) container.style.cursor = "grab";
        state.dragVelocityX = 0;
        state.dragVelocityY = 0;
      },
    });
  };

  const animate = () => {
    const state = stateRef.current;
    const canvas = canvasRef.current;

    if (!canvas) return;

    if (state.canDrag) {
      const ease = 0.075;
      state.currentX += (state.targetX - state.currentX) * ease;
      state.currentY += (state.targetY - state.currentY) * ease;

      if (canvas)
        canvas.style.transform = `translate(${state.currentX}px, ${state.currentY}px)`;

      const now = Date.now();
      const distMoved = Math.sqrt(
        Math.pow(state.currentX - state.lastX, 2) +
          Math.pow(state.currentY - state.lastY, 2)
      );

      if (distMoved > 100 || now - state.lastUpdateTime > 120) {
        updateVisibleItems();
        state.lastX = state.currentX;
        state.lastY = state.currentY;
        state.lastUpdateTime = now;
      }
    }

    state.animationFrameId = requestAnimationFrame(animate);
  };

  const handleMouseDown = (e: MouseEvent) => {
    const state = stateRef.current;

    if (!state.canDrag) return;
    state.isDragging = true;
    state.mouseHasMoved = false;
    state.startX = e.clientX;
    state.startY = e.clientY;
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: MouseEvent) => {
    const state = stateRef.current;

    if (!state.isDragging || !state.canDrag) return;

    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      state.mouseHasMoved = true;
    }

    const now = Date.now();
    const dt = Math.max(10, now - state.lastDragTime);
    state.lastDragTime = now;

    state.dragVelocityX = dx / dt;
    state.dragVelocityY = dy / dt;

    state.targetX += dx;
    state.targetY += dy;

    state.startX = e.clientX;
    state.startY = e.clientY;
  };

  const handleMouseUp = (e: MouseEvent) => {
    const state = stateRef.current;

    if (!state.isDragging) return;
    state.isDragging = false;

    if (state.canDrag) {
      if (containerRef.current) containerRef.current.style.cursor = "grab";

      if (
        Math.abs(state.dragVelocityX) > 0.1 ||
        Math.abs(state.dragVelocityY) > 0.1
      ) {
        const momentumFactor = 200;
        state.targetX += state.dragVelocityX * momentumFactor;
        state.targetY += state.dragVelocityY * momentumFactor;
      }
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    const state = stateRef.current;

    if (!state.canDrag) return;
    state.isDragging = true;
    state.mouseHasMoved = false;
    state.startX = e.touches[0].clientX;
    state.startY = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const state = stateRef.current;

    if (!state.isDragging || !state.canDrag) return;

    const dx = e.touches[0].clientX - state.startX;
    const dy = e.touches[0].clientY - state.startY;

    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      state.mouseHasMoved = true;
    }

    state.targetX += dx;
    state.targetY += dy;

    state.startX = e.touches[0].clientX;
    state.startY = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    stateRef.current.isDragging = false;
  };

  const handleOverlayClick = () => {
    if (stateRef.current.isExpanded) closeExpandedItem();
  };

  const handleResize = () => {
    const state = stateRef.current;

    if (state.isExpanded && state.expandedItem) {
      const viewportWidth = window.innerWidth;
      const targetWidth = viewportWidth * 0.4;
      const targetHeight = targetWidth * 1.2;

      gsap.to(state.expandedItem, {
        width: targetWidth,
        height: targetHeight,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      updateVisibleItems();
    }
  };

  const initializeGallery = () => {
    const container = containerRef.current;
    const overlay = overlayRef.current;

    if (!container || !overlay) return;

    if (container) {
      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
    }
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);
    if (overlay) overlay.addEventListener("click", handleOverlayClick);

    updateVisibleItems();
    animate();
  };

  return (
    <>
      <div className="container-canvas" ref={containerRef}>
        <div className="canvas" id="canvas" ref={canvasRef}></div>
        <div className="overlay" id="overlay" ref={overlayRef}></div>
      </div>

      <div className="project-title" ref={projectTitleRef}>
        <p></p>
      </div>
    </>
  );
}
