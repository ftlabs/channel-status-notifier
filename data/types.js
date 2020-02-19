module.exports = {
  AWAY_TYPES: (() => {
    return [
      {
        keywords: ["ill", "sick"],
        emoji: [":ill:", ":face_with_head_bandage:"],
        type: "ill"
      },
      {
        keywords: ["ooo", "office", "out", "busy", "conference", "training"],
        emoji: [":no_entry_sign:"],
        type: "ooo"
      },
      {
        keywords: ["home", "wfh", "working", "work"],
        emoji: [":house:", ":house_with_garden:", ":computer:"],
        type: "wfh"
      },
      {
        keywords: ["birthday", "cake", ":cake:"],
        emoji: [":birthday:", ":cake:", ":cupcake:"],
        type: "cake"
      },
      {
        keywords: ["mat", "maternity", "pat", "paternity", "parental"],
        emoji: [":baby:", ":baby_bottle:", ":pregnant_woman:"],
        type: "parent"
      },
      {
        keywords: [
          "holiday",
          "vacation",
          "vacationing",
          "annual",
          "leave",
          "al",
          "a/l",
          "travelling",
          "travel",
          "traveling"
        ],
        emoji: [":palm_tree:", ":airplane:", ":desert_island", ":sunny:"],
        type: "holiday"
      }
    ];
  })()
};
