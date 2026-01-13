# VS Code AI Agents Lab: Build a game with agentic coding

Giovani Ferrara `@yldgio`

## Checklist

- [ ] Latest VS Code **v1.107** (no update pending)
- [ ] Signed in with GitHub
  - Copilot Free can not run cloud agent!
- [ ] Git & Node installed
- [ ] Chat open and Agent ready for action

*Optional*: Use DevContainer or WSL.

## Setup


1. Open https://github.com/yldgio/nomina-nuda-tenemus
   1. *Use this template* > *Create a new repository* (make it *Public*)
      - ✅ Your own *soc-ops* GitHub repo is ready
   2. ⚠️ Enable *Settings* > *Pages* > *Deploy from a branch* to *GitHub Actions*
      - ✅ Any commit to the repo will publish the game as GitHub page: `http://{your-gh-username}.github.io/{name-of-your-repo}`
2. Open VS Code:
	1. Command: `Git: Clone > Clone from GitHub`
	2. Install recommended extensions (notification or `Extensions: Show Recommended Extensions`)
	3. Chat: Run `/setup` lets the agent figure out any required installation steps
3. 🎉 App is running and open in browser!

Keep this `.lab/GUIDE.md` open (📌 Pin).

## Learning Objectives

After completing this workshop, you:

1. **Can onboard AI to your codebase** and workflows with context engineering
2. **Understand the agentic primitives** to build an AI-first engineering flow
3. **Unlocked agentic abundance** to scale exploration and speed up learning across more development tasks
4. **felt the vibes** … hey, you designed and build your social social bingo; use to create more good vibes

## Recommendation

1. Keep the live-updated browser open
2. Commit working code often
3. Revert unexpected changes using chat *Checkpoints* and *Undo*, then try again

## 1. Context engineering your repo

DIY: Tour of the project. Try out the game.

### Task: Run and understand the /setup prompt

**TL;DR:** AI-guided installations, so you don't have to read docs.

See `.github/prompts/setup.prompt.md`.

### Task: Auto-generated instructions

**TL;DR:** Instructions guide all agentic codebase interactions, making them more efficient and reliable. Add them early, but make sure to keep them maintained and succinct.

1. Command `Chat: Generate Workspace Instructions File`
   1. While agent analyzes the codebase, optionally start next task
2. Review results, probably be too long and detailed
3. Follow-up *“Compress down by half and add a mandatory development [ ] checklist (lint, build, test) to the top”*
4. Commit instructions

Result: All future requests will have basic map of the workspace.

### Task: Background agents

**TL;DR:** Handoff tasks that don’t require handholding to background agents, which execute them isolated in git worktrees for quick parallel local iteration.

1. Chat `+` > `New background agent` / `New cloud agent`:
2. New Background agent: *Add linting rules for unused vars and awaits usage; and fix any errors*
   1. Review and *Apply*, then right-click delete the sessions.
3. New cloud agent: *Make the readme more engaging as landing page to the project*

Result: Agents completed adjusted the rules, fixed errors, and all edits are merged back into main. Stricter linting rules will catch any human/agent mistakes earlier.

### Task: Check Tailwind 4 instructions

**TL;DR**: Tailwind v4 instructions close gaps from training data and document the latest best practices.

See prompt in the footer.

**Optional**, if interested how it works: Delete main text and re-run the prompt

### Task: Check Frontend Instructions

**TL;DR**: The “no purple gradients” instructions, challanges the agent to think like a designer and be more bold and creative.

Source: Claude blog, linked in the footer.

**Optional**: What other agentic biases could you challenge and nudge?

## 2. Design-first Frontend Vibing

Now that we've engineered the repo context, let's get creative.

### Task: Make it yours

**TL;DR**: Plan mode to start off any bigger work items—iterate on the plan (2+ times!) with tweaks and clarifications.

Steps:
1. Switch to Plan mode
2. *Lets do a full redesign. Make it …*
3. Review plan and start Implement

Ideas:
- Minimalist Mono
- Grotesque Type Grid
- Retro Terminal Green
- Vaporwave Sunset
- Cyberpunk Neon
- Brutalist Blocks
- Soft Pastel Clouds
- Skeuomorphic Stickers
- Dark Mode Noir
- Playful Candy Pop
- Pixel Arcade Style
- Scandinavian Calm
- Corporate Clean Blue
- Gradient Glass UI
- Notebook Doodle Sketch
- Space Galaxy Glow
- Paper Card Cutouts
- Geometric Memphis
- Cozy Coffee Shop
- Metallic Chrome UI
- Bold Constructivist
- Eco Leafy Green
- Anime Bubble Aesthetic
- Monochrome Newspaper
- Chalkboard Classroom
- Yacht Club Nautical
- Desert Sand Minimal
- Bold Serif Vintage
- Toybox Primary Colors

Result: Frontend and tailwind instructions are use to build a beautiful design.

### Task: Keep instructions updated

**TL;DR**: Keep instructions updated with major architecture/design/dependency changes.

1. Follow-up: `Add design guide section to copilot-instructions.md`
2. Confirm, commit and push

Bonus: Check that GitHub pages is updating.

### Task: A lot more redesign

**TL;DR**: Scale exploration and learning with async cloud agents.

- New Chat with Plan mode
- `Redesign the start screen as more engaging landing page`
- *Result*: Lots of variations suggested in considerations
- Run the prompt: `/cloud-explore design variations`
  - See `.github/prompts/cloud-explore.prompt.md`
- Check Agent sessions for new 3 cloud agents appearing to track progress. Click to follow along or open agent in web.
- LATER: Review the 3 designs, based on screenshots in PRs.

**Result:** 3 cloud agent sessions which will take a few minutes to complete. Meanwhile …

## 3. Building with Agents

Time to add real features using the plan-first workflow.

### Task: Add a new game - "Trivia Blitz"

**TL;DR**: Use plan mode to architect a new game, then implement with agent assistance.

1. Switch to **Plan mode**
2. Prompt: *Add a new game called "Trivia Blitz" - players answer multiple choice questions, fastest correct answer gets most points, 10 questions per round*
3. Iterate on the plan (2+ times!):
   - *Add difficulty levels (easy/medium/hard)*
   - *Include category selection (science, history, pop culture, sports)*
   - *Show countdown timer with urgency animation*
4. Switch to Agent mode and implement
5. Test by playing with 2+ players
6. Commit with a descriptive message

**Bonus**: Use a background agent to generate 50+ trivia questions across categories:
- Chat `+` > New background agent
- *Generate 50 trivia questions in src/games/trivia-blitz/questions.ts - mix of easy/medium/hard across science, history, pop culture, sports categories*

**Result**: You've added a complete new game following existing patterns, guided by AI.

### Task: Create a /new-game prompt

**TL;DR**: Author a reusable prompt for adding games consistently.

1. Create `.github/prompts/new-game.prompt.md`:

```markdown
---
agent: agent
argument-hint: "Game Name" - brief description of mechanics
tools: ['read', 'search', 'editFiles', 'runInTerminal']
---

Create a new party game following existing patterns in src/games/.

## Requirements from user
{{input}}

## Checklist
- [ ] Game component in src/games/{game-name}/
- [ ] Game-specific types added to src/types/game.ts
- [ ] Prompts/data file if needed
- [ ] Route added to App.tsx
- [ ] Game card added to Home.tsx
- [ ] Barrel export in index.ts

## Reference existing games
- Word Chain: Timer-based word game with lives
- Quick Draw: Canvas drawing with guessing
- Emoji Charades: Emoji-only communication

Match the code style, component patterns, and state management approach.
```

2. Test it: `/new-game "Hot Potato" - pass a virtual potato between players, random timer (5-15s), last holder when timer expires loses a life, last player standing wins`

3. Review the implementation, iterate if needed

4. Commit the prompt

**Result**: Reusable prompt for consistent game creation across the team.

### Task: Quick game ideas to try

Use `/new-game` or plan mode with any of these:

| Game | Mechanics |
|------|-----------|
| **Reaction Race** | Random prompt appears, first to tap wins the round |
| **Story Builder** | Each player adds one sentence, vote on best story |
| **Lip Sync Battle** | Display lyrics, others guess the song |
| **Two Truths One Lie** | Players write 3 statements, others guess the lie |
| **Speed Sketch** | 10-second drawings, rapid fire rounds |
| **Mime Time** | Like charades but with a webcam silhouette |

## 4. Custom Agents

Create specialized agents for repeatable workflows.

### Task: Create an accessibility review agent

**TL;DR**: Build a custom agent that reviews UI for accessibility issues.

1. Create `.github/agents/a11y-review.agent.md`:

```markdown
---
name: Accessibility Review
argument-hint: Page or component to review (or "all")
tools: ['playwright/*', 'read', 'search', 'editFiles']
---

Review the application for WCAG 2.1 AA accessibility compliance.

## Review checklist
- [ ] Color contrast ratios (4.5:1 for text, 3:1 for large text)
- [ ] Keyboard navigation (all interactive elements focusable)
- [ ] Focus indicators visible and clear
- [ ] ARIA labels on icons and non-text elements
- [ ] Form labels properly associated
- [ ] Touch targets minimum 44x44px
- [ ] Motion respects prefers-reduced-motion

## Process
1. Use Playwright to navigate through the app
2. Check each page against the checklist
3. Generate a prioritized list of issues
4. Suggest specific code fixes

## Output
Markdown report with:
- Critical issues (blocking)
- Warnings (should fix)
- Suggestions (nice to have)
```

2. Run: `@a11y-review start` or `@a11y-review Home page`

3. Review findings and fix critical issues

4. Commit the agent and fixes

**Result**: Reusable agent for ongoing accessibility audits.

### Task: Create a game balance agent

**TL;DR**: Agent that analyzes game mechanics for balance and fun factor.

1. Create `.github/agents/game-balance.agent.md`:

```markdown
---
name: Game Balance Review  
argument-hint: Game name to analyze
tools: ['read', 'search']
---

Analyze a party game for balance, fairness, and fun factor.

## Analysis areas

### Timing
- Is the timer duration appropriate for the difficulty?
- Do players have enough time to think but still feel pressure?
- Are there dead periods where players are waiting?

### Scoring
- Is scoring fair across different player counts?
- Do early/late players have advantages?
- Is there comeback potential or does leader always win?

### Edge cases
- What happens if all players fail?
- What if only 2 players remain?
- Are there exploits or degenerate strategies?

### Engagement
- Is every player engaged even when not their turn?
- Is there variety to prevent repetition?
- What's the optimal game length?

## Output
Provide specific, actionable recommendations with code snippets.
```

2. Run: `@game-balance word-chain`

3. Implement suggested balance tweaks

4. Commit the agent

**Result**: AI-assisted game design validation you can run on any game.

### Task: Explore the UI Review agent

**TL;DR**: The repo includes a pre-built UI review agent using Playwright.

1. Make sure dev server is running (`npm run dev`)
2. Run: `@ui-review start`
3. Watch it navigate through the app and identify issues
4. Review the generated report

See `.github/agents/ui-review.agent.md` for implementation details.

## 5. Testing & Quality

Add automated testing with AI assistance.

### Task: Set up Vitest

**TL;DR**: Use a background agent to scaffold testing infrastructure.

1. Chat `+` > New background agent:
   *Set up Vitest with React Testing Library and jsdom. Add test and test:ui scripts to package.json. Create a sample test for the useTimer hook.*

2. Review and apply changes

3. Run `npm test` to verify setup

4. Update `AGENTS.md` checklist to include `npm test`

**Result**: Testing infrastructure ready for AI-generated tests.

### Task: Write tests with AI

**TL;DR**: Use plan mode to design test coverage, then implement.

1. Plan mode: *Write comprehensive tests for the useTimer hook covering: start, pause, resume, reset, expiry callback, and edge cases*

2. Review the test plan - are there missing scenarios?

3. Implement the tests

4. Plan mode: *Write tests for the gameStore - cover addPlayer, removePlayer, startGame, endGame, and score updates*

5. Implement and verify all tests pass

**Result**: Growing test suite with AI-generated test cases.

### Task: Add a test prompt

Create `.github/prompts/add-tests.prompt.md` for consistent test generation:

```markdown
---
agent: agent
argument-hint: Component, hook, or file to test
tools: ['read', 'search', 'editFiles', 'runInTerminal']
---

Write comprehensive tests for the specified code.

## Guidelines
- Use Vitest + React Testing Library
- Test behavior, not implementation
- Cover happy path, edge cases, and error states
- Mock external dependencies
- Use descriptive test names

## Reference
Check existing tests in __tests__/ or *.test.ts files for patterns.
```

## 6. Capstone: Multiplayer Lobby System

Tie everything together with a larger feature.

### Overview

Build a shareable lobby system where:
- Host creates a room with a shareable code
- Other players join via the code
- Real-time player list updates
- Host controls when to start the game

This exercise uses every skill from the workshop:
- **Context engineering** for architecture guidance
- **Plan mode** for design iteration  
- **Cloud agents** for exploring approaches
- **Custom agents** for review
- **Testing** for quality

### Step 1: Plan the architecture

1. Switch to **Plan mode**
2. Prompt: *Design a lobby system for this party game app. Host creates a room with a 4-letter code, others join by entering the code. Show real-time player list. Host has a "Start Game" button. Consider: What happens if host disconnects? How do we sync state?*
3. Iterate on the plan:
   - *What are the tradeoffs between localStorage+polling vs WebSockets vs a service like Partykit?*
   - *Keep it simple - what's the MVP that works for a demo?*

### Step 2: Explore implementation approaches

Run: `/cloud-explore lobby implementation`

The cloud agents will explore variations like:
- **LocalStorage + BroadcastChannel** (same device/browser only)
- **Partykit** (real WebSockets, free tier available)
- **Supabase Realtime** (PostgreSQL + realtime subscriptions)

Review the PRs when complete - each will have working code to compare.

### Step 3: Implement your choice

Based on the PR reviews, pick an approach and implement:

1. Merge the PR you prefer, OR
2. Use it as reference and implement in Agent mode

### Step 4: Review and polish

1. `@ui-review lobby flow` - check for UX issues
2. `@a11y-review lobby` - verify accessibility
3. `@game-balance` - does waiting in lobby feel good?

### Step 5: Document

1. Update `AGENTS.md` with new architecture notes
2. Update `README.md` with lobby instructions
3. Commit and push - watch GitHub Pages deploy!

**Result**: Full feature lifecycle with AI assistance at every stage.

---

## Resources

- [Awesome Copilot](https://github.com/github/awesome-copilot) - More customizations and examples
- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs) - Styling reference
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Partykit](https://www.partykit.io/) - Real-time multiplayer infrastructure
- [Vitest](https://vitest.dev/) - Fast unit testing

## What's Next?

After completing this workshop, try:

1. **Ship it**: Share your game URL with friends and play together
2. **Add more games**: Use `/new-game` to keep building
3. **Go multiplayer**: Implement the lobby system for real
4. **Contribute back**: PR your best game to the template repo
5. **Apply to your work**: Use these patterns in your own projects
