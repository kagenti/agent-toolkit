# Kagenti ADK Helm Chart

The Kagenti ADK helm chart is packaged and uploaded to the container registry for every release.
You can install the chart using the following command:

```bash
helm install adk -f config.yaml oci://ghcr.io/kagenti/adk/chart/adk:<release-version>
```

Check out the [documentation](https://github.com/kagenti/adk/blob/main/docs/stable/how-to/deployment-guide) for a detailed deployment guide.
