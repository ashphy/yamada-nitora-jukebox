exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Music implements Node {
      video: Video @link(by: "videoId")
    }
    
    type Video implements Node {
      musics: [Music] @link(by: "video.videoId", from: "videoId")
      date: Date
    }
  `;
  createTypes(typeDefs);
};
