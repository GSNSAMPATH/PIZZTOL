"use client";

import {
  Ban,
  Ellipsis,
  Eye,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
} from "react";

interface ProductActionsProps {
  productId: number;
}

const MENU_WIDTH = 170;
const MENU_HEIGHT = 240;
const GAP = 6;
const SCREEN_PADDING = 8;

export default function ProductActions({
  productId,
}: ProductActionsProps) {
  const [open, setOpen] = useState(false);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });

  const buttonRef = useRef<HTMLButtonElement>(null);

  const router = useRouter();

  const updateMenuPosition = () => {
    if (!buttonRef.current) return;

    const rect =
      buttonRef.current.getBoundingClientRect();

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    /*
     * Check available space
     */
    const spaceBelow =
      viewportHeight - rect.bottom;

    const spaceAbove = rect.top;

    /*
     * Open upward when there isn't enough
     * space below.
     */
    const openUp =
      spaceBelow < MENU_HEIGHT + GAP &&
      spaceAbove > MENU_HEIGHT + GAP;

    /*
     * Vertical position
     */
    let top;

    if (openUp) {
      top =
        rect.top -
        MENU_HEIGHT -
        GAP;
    } else {
      top =
        rect.bottom +
        GAP;
    }

    /*
     * Keep inside viewport vertically
     */
    top = Math.max(
      SCREEN_PADDING,
      Math.min(
        top,
        viewportHeight -
          MENU_HEIGHT -
          SCREEN_PADDING
      )
    );

    /*
     * Align menu to the right side
     * of the button.
     */
    let left =
      rect.right -
      MENU_WIDTH;

    /*
     * Keep menu inside viewport horizontally.
     */
    left = Math.max(
      SCREEN_PADDING,
      Math.min(
        left,
        viewportWidth -
          MENU_WIDTH -
          SCREEN_PADDING
      )
    );

    setMenuPosition({
      top,
      left,
    });
  };

  const handleToggle = () => {
    if (!open) {
      updateMenuPosition();
    }

    setOpen((prev) => !prev);
  };

  /*
   * Reposition when window changes size
   */
  useEffect(() => {
    if (!open) return;

    const handleResize = () => {
      updateMenuPosition();
    };

    const handleScroll = () => {
      updateMenuPosition();
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    window.addEventListener(
      "scroll",
      handleScroll,
      true
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );

      window.removeEventListener(
        "scroll",
        handleScroll,
        true
      );
    };
  }, [open]);

  /*
   * Close with Escape
   */
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="
          flex
          h-8
          w-8
          items-center
          justify-center
          text-[#222]
          transition
          hover:bg-[#f3f3f3]
        "
        aria-label="Product actions"
        aria-expanded={open}
      >
        <Ellipsis
          size={17}
          strokeWidth={2}
        />
      </button>

      {open && (
        <>
          {/* Outside click */}
          <div
            className="fixed inset-0 z-[999]"
            onClick={() => setOpen(false)}
          />

          {/* Menu */}
          <div
            className="
              fixed
              z-[1000]
              overflow-hidden
              bg-white
              py-1
              shadow-[0_4px_18px_rgba(0,0,0,0.14)]
              ring-1
              ring-black/10
            "
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
              width: MENU_WIDTH,
            }}
          >
            {/* View Product */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);

                console.log(
                  "View Product:",
                  productId
                );
              }}
              className="
                flex
                h-[48px]
                w-full
                items-center
                gap-3
                px-4
                text-left
                text-[14px]
                text-[#161616]
                transition
                hover:bg-[#f5f5f5]
              "
            >
              <Eye
                size={19}
                strokeWidth={1.8}
              />

              <span>
                View Product
              </span>
            </button>

            {/* Disable Product */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);

                console.log(
                  "Disable Product:",
                  productId
                );
              }}
              className="
                flex
                h-[48px]
                w-full
                items-center
                gap-3
                px-4
                text-left
                text-[14px]
                text-[#161616]
                transition
                hover:bg-[#f5f5f5]
              "
            >
              <Ban
                size={19}
                strokeWidth={1.8}
              />

              <span>
                Disable Product
              </span>
            </button>

            {/* Edit Product */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(
  `/admin/products/edit/${productId}`
);

                console.log(
                  "Edit Product:",
                  productId
                );
              }}
              className="
                flex
                h-[48px]
                w-full
                items-center
                gap-3
                px-4
                text-left
                text-[14px]
                text-[#161616]
                transition
                hover:bg-[#f5f5f5]
              "
            >
              <Pencil
                size={19}
                strokeWidth={1.8}
              />

              <span>
                Edit Product
              </span>
            </button>

            {/* Update Stock */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);

                console.log(
                  "Update Stock:",
                  productId
                );
              }}
              className="
                flex
                h-[48px]
                w-full
                items-center
                gap-3
                px-4
                text-left
                text-[14px]
                text-[#161616]
                transition
                hover:bg-[#f5f5f5]
              "
            >
              <Plus
                size={20}
                strokeWidth={1.8}
              />

              <span>
                Update Stock
              </span>
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);

                console.log(
                  "Delete Product:",
                  productId
                );
              }}
              className="
                flex
                h-[48px]
                w-full
                items-center
                gap-3
                px-4
                text-left
                text-[14px]
                text-red-600
                transition
                hover:bg-red-50
              "
            >
              <Trash2
                size={18}
                strokeWidth={1.8}
              />

              <span>
                Delete
              </span>
            </button>
          </div>
        </>
      )}
    </>
  );
}