import React from "react";

const TestUi = () => {
  return (
    <div>
      <section className="mx-auto max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-evenly">
          {/* Main Grid Item with Image and Overlay */}
          <div className="md:row-span-3 md:col-span-2  relative">
            <div className="overflow-hidden rounded-sm relative">
              <img
                src="https://www.hollywoodreporter.com/wp-content/uploads/2025/02/Taylor-Lautner-Selena-Gomez-getty-H-2025.png?w=1296&h=730&crop=1"
                alt="Selena Gomez"
                className="w-full h-[380px] object-cover hover:scale-105 ease-in-out transition-transform duration-300"
              />
              {/* Overlay Card */}
              <div className="absolute top-4 left-4 right-4 bg-sky-50 p-4 rounded-sm md:w-1/2  bottom-4 grid justify-end">
                <div className="">
                  <p className="text-xs px-5 py-2 bg-teritory w-fit rounded-lg text-light mb-[12px]">
                    Oct 14, 2024
                  </p>
                  <p className="text-primary fw-500 text-[26px]">
                    Understanding the social movements reshaping our world today
                  </p>
                </div>
                <p className="text-sm fw-400">
                  <span>By.</span>
                  <span>Guy Hawkins</span>
                  <span>/ Publisher</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right-side Grid Items */}
          <div className="">
            <div className="flex items-center justify-between">
              <div className="image-container mr-[8px] overflow-hidden rounded-sm relative">
                <img
                  src="https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638892472/EducationHub/photos/new-york-protesters.jpg"
                  alt=""
                  className="w-[182px] rounded-sm object-cover object-center aspect-square hover:scale-105 ease-in-out transition-transform duration-300"
                />
              </div>
              <div className="">
                <p className="text-xs text-primary flex item-center">
                  <span>Guy Hawkins</span>-<span>Sep 9, 2024</span>
                </p>
                <p className="fw-500 text-[18px]">
                  The global financial landscape and its implications for all
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="image-container mr-[8px] overflow-hidden rounded-sm relative">
                <img
                  src="https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638892472/EducationHub/photos/new-york-protesters.jpg"
                  alt=""
                  className="w-[182px] rounded-sm object-cover object-center aspect-square hover:scale-105 ease-in-out transition-transform duration-300"
                />
              </div>
              <div className="">
                <p className="text-xs text-primary flex item-center">
                  <span>Guy Hawkins</span>-<span>Sep 9, 2024</span>
                </p>
                <p className="fw-500 text-[18px]">
                  The global financial landscape and its implications for all
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-end">
            <div className="flex items-center">
              <div className="image-container mr-[8px] overflow-hidden rounded-sm relative">
                <img
                  src="https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638892472/EducationHub/photos/new-york-protesters.jpg"
                  alt=""
                  className="w-[182px] rounded-sm object-cover object-center aspect-square hover:scale-105 ease-in-out transition-transform duration-300"
                />
              </div>
              <div className="">
                <p className="text-xs text-primary flex item-center">
                  <span>Guy Hawkins</span>-<span>Sep 9, 2024</span>
                </p>
                <p className="fw-500 text-[18px]">
                  The global financial landscape and its implications for all
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestUi;
