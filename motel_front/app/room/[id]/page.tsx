"use client";
import { Header } from "@/components/header/Header";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getRoomByPublicId } from "@/actions/rooms";
import { SuiteDetailCarousel } from "@/components/suite-detail-carousel.tsx/SuiteDetailCarousel";
import { BookingSection } from "@/components/booking-section/BookingSection";
import { useUserStore } from "@/store/user-store";
import { SuitesSection } from "@/components/suites-section/SuitesSection";
import { LocationSection } from "@/components/location-section/LocationSection";

export default function RoomPage() {
  const params = useParams();
  const [name, setName] = useState("");
  const [image, setImage] = useState<string[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [publicId, setPublicId] = useState("");
  const email = useUserStore((state) => state.email);

  const fetchRoomData = useCallback(async () => {
    if (!params.id) return;
    const data = await getRoomByPublicId(params.id as string);
    if (data) {
      setName(data.name);
      setImage(data.images.map((img) => img.url));
      setPrice(data.hourlyRate);
      setPublicId(data.publicId);
    }

    console.log("Room Data:", data);
  }, [params.name]);

  useEffect(() => {
    fetchRoomData();
  }, [fetchRoomData, params]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-1 flex flex-col p-4">
        <SuiteDetailCarousel suiteName={name} images={image} />

        <BookingSection
          suiteName={name}
          pricePerHour={price}
          roomPublicId={publicId}
          isLoggedIn={email !== ""}
        />

        <SuitesSection />

        <LocationSection />
      </div>
    </main>
  );
}
