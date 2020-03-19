module.exports = {
  AWAY_TYPES: (() => {
    return [
      {
        keywords: ["ill", "sick"],
        emoji: [":ill:", ":face_with_head_bandage:"],
        type: "ill",
        message: ":ill: *Off sick:*"
      },
      {
        keywords: ["ooo", "office", "out", "busy", "conference", "training"],
        emoji: [":no_entry_sign:"],
        type: "ooo",
        message: ":no_entry_sign: *Out of office:*"
      },
      {
        keywords: ["home", "wfh", "working", "work"],
        emoji: [":house:", ":house_with_garden:", ":computer:"],
        type: "wfh",
        message: ":house_with_garden: *WFH:*"
      },
      {
        keywords: ["birthday", "cake", ":cake:"],
        emoji: [":birthday:", ":cake:", ":cupcake:"],
        type: "cake",
        message: "`:cake: *Would like some cake:*"
      },
      {
        keywords: ["mat", "maternity", "pat", "paternity", "parental"],
        emoji: [":baby:", ":baby_bottle:", ":pregnant_woman:"],
        type: "parent",
        message: ":baby: *On parental leave:*"
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
        type: "holiday",
        message: ":palm_tree: *On holiday:*"
      },
      {
        keywords: [
          "lunch",
          "food",
          "snack",
          "dinner",
          "eating",
          "munching",
          "brunch",
          "breakfast",
          "snacking"
        ],
        emoji: [":spagbol:", ":spaghetti:", ":desert_island", ":yum:"],
        type: "lunch",
        message: ":spagbol: *On lunch:*"
      },
      {
        keywords: ["walk", "walking", "break", "breaking"],
        emoji: [":walking:", ":woman-walking:"],
        type: "walking",
        message: ":walking: *Getting some fresh air:*"
      },
      {
        keywords: ["caring", "child", "childcare", "entertaining"],
        emoji: [":child:"],
        type: "caring",
        message: ":walking: *Looking after someone else:*"
      },
      {
        keywords: ["caring", "child", "childcare", "entertaining"],
        emoji: [":child:"],
        type: "caring",
        message: ":walking: *Looking after someone else:*"
      },
      {
        keywords: ["Unavailable"],
        emoji: [":blockers:"],
        type: "unavailable",
        message: ":blockers: *Unavailable:*"
      }
    ];
  })()
};
