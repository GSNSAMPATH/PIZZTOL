"use client";

import { Plus } from "lucide-react";

import type { ProductVolume } from "@/app/types/product";

interface ProductVolumesProps {
  volumes: ProductVolume[];

  selectedVolumes: number[];

  onChange: (
    volumes: number[]
  ) => void;

  onGenerate: () => void;
}

export default function ProductVolumes({
  volumes,
  selectedVolumes,
  onChange,
  onGenerate,
}: ProductVolumesProps) {
  function toggleVolume(volumeId: number) {
    if (
      selectedVolumes.includes(
        volumeId
      )
    ) {
      onChange(
        selectedVolumes.filter(
          (id) =>
            id !== volumeId
        )
      );
    } else {
      onChange([
        ...selectedVolumes,
        volumeId,
      ]);
    }
  }

  return (
    <div>
      {/* =====================================================
          AVAILABLE VOLUMES
      ===================================================== */}

      <h3 className="mb-6 text-[13px] font-semibold text-[#09213f]">
        Available Volumes
      </h3>

      {volumes.length === 0 ? (
        <div
          className="
            border
            border-dashed
            border-[#d8d8d8]
            bg-white
            px-5
            py-4
            text-[12px]
            text-gray-500
          "
        >
          No volumes available.
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          {volumes.map((volume) => {
            const isSelected =
              selectedVolumes.includes(
                volume.id
              );

            return (
              <label
                key={volume.id}
                className="
                  flex
                  cursor-pointer
                  items-center
                  gap-3
                  text-[13px]
                  font-semibold
                  text-[#09213f]
                "
              >
                {/* Volume Name */}

                <span>
                  {volume.name}
                </span>

                {/* Checkbox */}

                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() =>
                    toggleVolume(
                      volume.id
                    )
                  }
                  className="
                    h-6
                    w-6
                    cursor-pointer
                    appearance-none
                    rounded-none
                    border
                    border-white
                    bg-white
                    outline-none
                    transition
                    checked:border-black
                    checked:bg-black
                    checked:bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22none%22 stroke=%22white%22 stroke-width=%222.5%22%3E%3Cpath d=%22m4 10 4 4 8-8%22/%3E%3C/svg%3E')]
                    checked:bg-center
                    checked:bg-no-repeat
                    checked:bg-[length:16px_16px]
                    focus:outline-none
                    focus:ring-0
                  "
                />
              </label>
            );
          })}
        </div>
      )}

      {/* =====================================================
          SELECTED COUNT
      ===================================================== */}

      {selectedVolumes.length > 0 && (
        <p className="mt-4 text-[11px] text-gray-500">
          {selectedVolumes.length} volume
          {selectedVolumes.length !== 1
            ? "s"
            : ""}{" "}
          selected
        </p>
      )}

      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <div className="mt-7 flex flex-wrap gap-7">
        {/* Clear Selected Volumes */}

        {selectedVolumes.length >
          0 && (
          <button
            type="button"
            onClick={() =>
              onChange([])
            }
            className="
              flex
              items-center
              gap-2
              text-[12px]
              font-medium
              text-[#09213f]
              hover:underline
            "
          >
            <span className="text-[17px]">
              −
            </span>

            Remove Volume
          </button>
        )}

        {/* Generate Variants */}

        <button
          type="button"
          onClick={onGenerate}
          disabled={
            selectedVolumes.length ===
            0
          }
          className="
            flex
            items-center
            gap-2
            text-[12px]
            font-medium
            text-[#09213f]
            hover:underline
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:no-underline
          "
        >
          <Plus size={14} />

          Generate Variants
        </button>
      </div>
    </div>
  );
}