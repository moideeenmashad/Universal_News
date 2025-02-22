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
      img: "https://www.artificialintelligence-news.com/wp-content/uploads/2025/02/grok-3-ai-model-xai-reasoning-artificial-intelligence-benchmarks-elon-musk-development-ethics.jpg",
      title: "Technology",
      assert: "The latest trends in AI and innovation",
    },
    {
      id: 3,
      img: "https://www.aljazeera.com/wp-content/uploads/2024/08/2024-08-16T062607Z_498023022_RC213Z9IMEC1_RTRMADP_3_HEALTH-MPOX-PAKISTAN-1723793768.jpg?resize=770%2C513&quality=80",
      title: "Health",
      assert: "Analyzing the effects of global health policies",
    },
    {
      id: 4,
      img: "https://th-i.thgim.com/public/sport/xa9qka/article69243783.ece/alternates/FREE_1200/Ugo%20Blanchet.JPG",
      title: "Sports",
      assert: "Effects of cutting-edge wearables in professional sports",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 mx-auto max-w-screen-xl gap-8 mb-[30px]">
      {/* Loop start here */}
      {FeaturedList.map((value) => (
        <div key={value.id} className="flex items-center">
          <img
            src={value.img}
            alt={value.title}
            className="w-20 h-20 rounded-sm mr-[10px] object-cover object-center"
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
