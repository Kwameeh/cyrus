"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useTransitionRouter } from "next-view-transitions";
import { projects } from "@/libs/data";
import styles from "./page.module.css";

export default function Home() {
  const router = useTransitionRouter();
  const params = useParams();
  const idParam = Array.isArray((params as any)?.id)
    ? (params as any).id[0]
    : (params as any)?.id;
  const projectIndex = Number.isFinite(parseInt(idParam as string, 10))
    ? parseInt(idParam as string, 10)
    : 0;
  const project = projects[projectIndex] ?? projects[0];
  const images =
    project?.gallery && project.gallery.length > 0
      ? project.gallery
      : [project?.image ?? ""];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const previewImageRef = useRef<HTMLImageElement | null>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const translateRef = useRef<{ current: number; target: number; max: number }>(
    {
      current: 0,
      target: 0,
      max: 0,
    }
  );

  const [isHorizontal, setIsHorizontal] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const dimensionsRef = useRef<{
    itemSize: number;
    containerSize: number;
    indicatorSize: number;
  }>({
    itemSize: 0,
    containerSize: 0,
    indicatorSize: 0,
  });

  const activeItemOpacity = 0.3;
  const isClickMoveRef = useRef<boolean>(false);

  const lerp = (start: number, end: number, factor: number): number => {
    return start + (end - start) * factor;
  };

  const updateDimensions = (): void => {
    const newIsHorizontal = window.innerWidth <= 900;
    const firstItem = itemRefs.current[0];

    if (!firstItem || !itemsRef.current || !indicatorRef.current) return;

    const newDimensions = {
      itemSize: newIsHorizontal
        ? firstItem.getBoundingClientRect().width
        : firstItem.getBoundingClientRect().height,
      containerSize: newIsHorizontal
        ? itemsRef.current.scrollWidth
        : itemsRef.current.getBoundingClientRect().height,
      indicatorSize: newIsHorizontal
        ? indicatorRef.current.getBoundingClientRect().width
        : indicatorRef.current.getBoundingClientRect().height,
    };

    dimensionsRef.current = newDimensions;
    translateRef.current.max =
      newDimensions.containerSize - newDimensions.indicatorSize;

    if (isHorizontal !== newIsHorizontal) {
      setIsHorizontal(newIsHorizontal);
    }
  };

  const getItemInIndicator = (): number => {
    itemRefs.current.forEach((item) => {
      const img = item?.querySelector("img") as HTMLImageElement | null;
      if (img) {
        img.style.opacity = "1";
      }
    });

    const indicatorStart = -translateRef.current.current;
    const indicatorEnd = indicatorStart + dimensionsRef.current.indicatorSize;

    let maxOverlap = 0;
    let selectedIndex = 0;

    itemRefs.current.forEach((item, index) => {
      const itemStart = index * dimensionsRef.current.itemSize;
      const itemEnd = itemStart + dimensionsRef.current.itemSize;

      const overlapStart = Math.max(indicatorStart, itemStart);
      const overlapEnd = Math.min(indicatorEnd, itemEnd);
      const overlap = Math.max(0, overlapEnd - overlapStart);

      if (overlap > maxOverlap) {
        maxOverlap = overlap;
        selectedIndex = index;
      }
    });

    const selectedImg = itemRefs.current[selectedIndex]?.querySelector(
      "img"
    ) as HTMLImageElement | null;
    if (selectedImg) {
      selectedImg.style.opacity = activeItemOpacity.toString();
    }
    return selectedIndex;
  };

  const updatePreviewImage = (index: number): void => {
    if (currentImageIndex !== index) {
      setCurrentImageIndex(index);
      if (previewImageRef.current) {
        previewImageRef.current.src = images[index] ?? "";
      }
    }
  };

  const animate = (): void => {
    const lerpFactor = isClickMoveRef.current ? 0.05 : 0.075;
    translateRef.current.current = lerp(
      translateRef.current.current,
      translateRef.current.target,
      lerpFactor
    );

    if (
      Math.abs(translateRef.current.current - translateRef.current.target) >
      0.01
    ) {
      const transform = isHorizontal
        ? `translateX(${translateRef.current.current}px)`
        : `translateY(${translateRef.current.current}px)`;

      if (itemsRef.current) {
        itemsRef.current.style.transform = transform;
      }

      const activeIndex = getItemInIndicator();
      updatePreviewImage(activeIndex);
    } else {
      isClickMoveRef.current = false;
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      isClickMoveRef.current = false;

      const delta = e.deltaY;
      const scrollVelocity = Math.min(Math.max(delta * 0.5, -20), 20);

      translateRef.current.target = Math.min(
        Math.max(
          translateRef.current.target - scrollVelocity,
          -translateRef.current.max
        ),
        0
      );
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (isHorizontal) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isHorizontal) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;

        const scrollVelocity = Math.min(Math.max(deltaY * 0.5, -20), 20);

        translateRef.current.target = Math.min(
          Math.max(
            translateRef.current.target - scrollVelocity,
            -translateRef.current.max
          ),
          0
        );

        touchStartY = touchY;
        e.preventDefault();
      }
    };

    const handleResize = (): void => {
      updateDimensions();

      translateRef.current.target = Math.min(
        Math.max(translateRef.current.target, -translateRef.current.max),
        0
      );
      translateRef.current.current = translateRef.current.target;

      const transform = isHorizontal
        ? `translateX(${translateRef.current.current}px)`
        : `translateY(${translateRef.current.current}px)`;

      if (itemsRef.current) {
        itemsRef.current.style.transform = transform;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
    }

    window.addEventListener("resize", handleResize);

    updateDimensions();
    const firstImg = itemRefs.current[0]?.querySelector(
      "img"
    ) as HTMLImageElement | null;
    if (firstImg) {
      firstImg.style.opacity = activeItemOpacity.toString();
    }
    updatePreviewImage(0);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchmove", handleTouchMove);
      }
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isHorizontal]);

  const handleItemClick = (index: number): void => {
    isClickMoveRef.current = true;
    const newTranslate =
      -index * dimensionsRef.current.itemSize +
      (dimensionsRef.current.indicatorSize - dimensionsRef.current.itemSize) /
        2;

    translateRef.current.target = Math.max(
      Math.min(newTranslate, 0),
      -translateRef.current.max
    );
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

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        type="button"
        aria-label="Go back"
        className={styles.backButton}
        onClick={() => router.push("/", { onTransitionReady: slideInOut })}>
        ← Back
      </button>
      <div className={styles["site-info"]}>
        <p>RAW</p>
        <p>
          <span>{project?.title ?? "Project"}</span>
        </p>
      </div>

      <div className={styles["img-preview"]}>
        <img
          ref={previewImageRef}
          src={images[0] ?? ""}
          alt={project?.title ?? ""}
        />
      </div>

      <div className={styles.minimap}>
        <div className={styles.indicator} ref={indicatorRef}></div>
        <div className={styles.items} ref={itemsRef}>
          {images.map((src, index) => (
            <div
              key={`${project?.title ?? "project"}-${index}`}
              className={styles.item}
              ref={(el) => {
                if (el) itemRefs.current[index] = el;
              }}
              onClick={() => handleItemClick(index)}>
              <img src={src} alt={project?.title ?? ""} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
