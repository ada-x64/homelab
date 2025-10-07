# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automating various tasks in the ada-net-dash project.

## Build and Publish Container

The `build-and-publish.yml` workflow automatically builds and publishes Docker containers to GitHub Container Registry (GHCR).

### Triggers

The workflow runs on:
- **Push to main/master branch**: Builds and publishes with `latest` tag
- **Push tags starting with 'v'**: Builds and publishes with semantic version tags
- **Pull requests**: Builds container but doesn't publish (for testing)

### What it does

1. **Checks out code** from the repository
2. **Sets up Docker Buildx** for multi-platform builds
3. **Logs into GHCR** using the GitHub token (only for pushes, not PRs)
4. **Extracts metadata** to generate appropriate tags and labels
5. **Builds the container** for both AMD64 and ARM64 architectures
6. **Pushes to GHCR** (only for pushes to main/master or tags)
7. **Generates attestation** for supply chain security

### Container Tags

The workflow automatically creates these tags:
- `latest` - for pushes to the default branch
- `main` or `master` - for pushes to respective branches
- `v1.2.3`, `v1.2`, `v1` - for semantic version tags
- `main-abc123` - branch name with short commit SHA
- `pr-123` - for pull requests

### Usage

The workflow runs automatically when you:

```bash
# Push to main branch (creates 'latest' tag)
git push origin main

# Create and push a version tag (creates version tags)
git tag v1.0.0
git push origin v1.0.0

# Create a pull request (builds but doesn't publish)
# This helps verify the container builds successfully
```

### Pulling the Container

After the workflow runs successfully, you can pull your container:

```bash
# Pull latest version
docker pull ghcr.io/your-username/ada-net-dash:latest

# Pull specific version
docker pull ghcr.io/your-username/ada-net-dash:v1.0.0
```

### Permissions

The workflow requires:
- `contents: read` - to checkout the repository
- `packages: write` - to publish to GHCR

These permissions are automatically available to GitHub Actions in your repository.

### Security Features

- **Multi-platform builds** - Supports both AMD64 and ARM64 architectures
- **Build caching** - Uses GitHub Actions cache to speed up builds
- **Attestation generation** - Creates cryptographic proof of how the container was built
- **Secure authentication** - Uses GitHub's built-in token, no manual secrets needed

### Troubleshooting

If the workflow fails:

1. **Check the Actions tab** in your GitHub repository for detailed logs
2. **Verify Dockerfile** builds locally with `docker build .`
3. **Check permissions** - ensure Actions have write access to packages
4. **Review tags** - make sure you're not pushing duplicate tags

For package visibility issues, go to your repository settings → Packages → Change visibility to public if needed.