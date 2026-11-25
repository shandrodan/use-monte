# Review

For "check this before I ship" or one named screen or flow.

1. **Scope.** Use the screen or flow the person named. With none named, use the screens the branch changed, and with no changes, the five top routes.
2. **Run lookout** on the scope. The installed system's own rules come first, then lookout's default criteria.
3. **Spot-check.** Open lookout's captures and rerun one probe it reports. Why: a review that nobody reran is a claim, not evidence.
4. **Report** lookout's answer line, its ship line and the ranked findings.
5. **Offer the fix** as one prompt per `blocking` finding, each phrased as a check that fails on the current build.

Done when every finding has a capture and a criterion.
