module.exports = {
  AWAY_TYPES: (() => {
    return [
      {
        keywords: ["ill", "sick"],
        emoji: [":ill:", ":face_with_head_bandage:", ":face_with_thermometer:"],
        defaultEmoji: "ill",
        type: "ill",
        message: ":ill: *Off sick:* \n"
      },
      {
        keywords: ["ooo", "office", "out", "busy", "conference", "training"],
        emoji: [":no_entry_sign:"],
        defaultEmoji: "no_entry_sign",
        type: "ooo",
        message: ":no_entry_sign: *Out of office:* \n"
      },
      {
        keywords: ["home", "wfh", "working", "work"],
        emoji: [":house:", ":house_with_garden:", ":computer:", ":wfh:"],
        defaultEmoji: "house",
        type: "wfh",
        message: ":house_with_garden: *WFH:* \n"
      },
      {
        keywords: ["birthday", "cake", ":cake:"],
        emoji: [":birthday:", ":cake:", ":cupcake:"],
        defaultEmoji: "birthday",
        type: "cake",
        message: "`:cake: *Would like some cake:* \n"
      },
      {
        keywords: ["mat", "maternity", "pat", "paternity", "parental"],
        emoji: [":baby:", ":baby_bottle:", ":pregnant_woman:"],
        defaultEmoji: "baby",
        type: "parent",
        message: ":baby: *On parental leave:* \n"
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
        defaultEmoji: "palm_tree",
        type: "holiday",
        message: ":palm_tree: *On holiday:* \n"
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
        emoji: [":spagbol:", ":spaghetti:", ":yum:"],
        type: "lunch",
        defaultEmoji: "spagbol",
        message: ":spagbol: *On lunch:* \n"
      },
      {
        keywords: ["walk", "walking", "break", "breaking", "air"],
        emoji: [":walking:", ":woman-walking:", ":man-walking:"],
        defaultEmoji: "walking",
        type: "walking",
        message: ":walking: *Getting some fresh air:* \n"
      },
      {
        keywords: ["caring", "child", "childcare", "entertaining"],
        emoji: [":child:"],
        defaultEmoji: "child",
        type: "caring",
        message: ":child: *Looking after someone else:* \n"
      },
      {
        keywords: ["unavailable"],
        emoji: [":blockers:, :no_entry:"],
        defaultEmoji: "blockers",
        type: "unavailable",
        message: ":blockers: *Unavailable:* \n"
      }
    ];
  })()
};
