import React from "react";

const Featured = () => {
  const FeaturedList = [
    {
      id: 1,
      img: "https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638892472/EducationHub/photos/new-york-protesters.jpg",
      title: "World News",
      assert: "Economic policies are shaping international markets",
    },
    {
      id: 2,
      img: "https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638892472/EducationHub/photos/new-york-protesters.jpg",
      title: "Technology",
      assert: "The latest trends in AI and innovation",
    },
    {
      id: 3,
      img: "https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638892472/EducationHub/photos/new-york-protesters.jpg",
      title: "Health",
      assert: "Analyzing the effects of global health policies",
    },
    {
      id: 4,
      img: "https://images.nationalgeographic.org/image/upload/t_edhub_resource_key_image/v1638892472/EducationHub/photos/new-york-protesters.jpg",
      title: "Sports",
      assert: "Effects of cutting-edge wearables in professional sports",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 mx-auto max-w-screen-xl gap-6">
      {/* Loop start here */}
      {FeaturedList.map((value) => (
        <div key={value.id} className="flex items-center">
          <img
            src={value.img}
            alt={value.title}
            className="w-20 h-20 rounded-sm mr-[10px]"
          />
          <div>
            <p className="font-semibold text-sm uppercase">{value.title}</p>
            <p className="font-medium text-xs leading-[21px]">{value.assert}</p>
          </div>
        </div>
      ))}
      {/* Loop ends here */}
    </div>
  );
};

export default Featured;
