export const resources = [
  { name: 'gizmo', displayName: '⚙️ Gizmos', timeToCraft: 2000, requirements: {} },
  { name: 'bot', displayName: '🔧 Bots', timeToCraft: 4000, requirements: { gizmo: 5 } },
  { name: 'droid', displayName: '🔋 Droids', timeToCraft: 4000, requirements: { bot: 20 } },
  { name: 'logicalRobot', displayName: '🤖 Logical Robots', timeToCraft: 4000, requirements: { bot: 20, gizmo: 100 } }
];